import fs from'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import path from 'path';
import { Configuration, OpenAIApi } from "openai";
import { createClient } from '@supabase/supabase-js'
require('dotenv').config()

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Clear Tables
async function deleteTables() {
  const { data: sectionData, error: sectionError } = await supabase
    .from("file_section")
    .delete().neq('id', '00000000-0000-0000-0000-000000000000');
  // console.log(sectionData, sectionError);

  const { data: fileData, error: fileError } = await supabase
    .from("file")
    .delete().neq('id', '00000000-0000-0000-0000-000000000000');
  // console.log(fileData, fileError);
}

const readFileContent = (file_path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file_path, (err, data) => {
      if (err) reject(err);
      resolve(data.toString());
    });
  });
};

async function updateFileChunkTable(object) {
  const { data, error } = await supabase
      .from("file_section")
      .insert({
          id: object.id,
          parent_file_id: object.parent_id,
          content: object.content,
          embedding: object.embedding
      })
      .select();
  // console.log(data, error);
  return;
};

async function updateFileTable(object) {
  const { data, error } = await supabase
      .from("file")
      .insert({
          id: object.id,
          path: object.path,
          type: object.type,
          name: object.name,
          content: object.content
      })
      .select();
  // console.log(data);
  return;
};

export const generateEmbedding = async(input) => {
  const response = await openai.createEmbedding({
    model: "text-embedding-ada-002",
    input: input,
  });
  return response.data.data;
};


async function chunkDoc(doc, size = 500, overlap = 25) {
  const text_content = doc.content;
  const chunk_amt = Math.ceil(text_content.length / size);

  const chunks = [];
  for(let i = 0; i < chunk_amt; i++) {
    const start = i * size;
    const end = start + size;
    const chunk = text_content.substring(start, end);
    const embedding = (await generateEmbedding(chunk))[0].embedding;

    const fileChunk = {
      id: crypto.randomUUID(),
      parent_id: doc.id,
      content: chunk,
      embedding: embedding
    }

    await updateFileChunkTable(fileChunk);
  };
};

export const walkDirectory = async (dir, documents = []) => {
  const exclude_dir = ['.git', 'node_modules', 'public', 'assets']
  const exclude_files = ['package-lock.json', '.DS_Store']
  const exclude_extensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'ico', 'svg', 'webp', 'mp3', 'wav']

  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    
    const fileCheck = (entry.isFile() && !exclude_files.includes(entry.name) && !exclude_extensions.includes(entry.name.split('.')[1]));
    const dirCheck = (entry.isDirectory() && !exclude_dir.includes(entry.name));
    
    const fullPath = path.join(dir, entry.name);
    // if file
    if (fileCheck){
      const fileObject = {
        id: crypto.randomUUID(),
        path: fullPath,
        type: entry.name.split('.')[1],
        name: entry.name,
        content: await readFileContent(fullPath)
      };
      await updateFileTable(fileObject);
      documents.push(fileObject);
    }
    // if directory
    else if (dirCheck) {
      const subDirectoryDocuments = await walkDirectory(fullPath);
      documents = documents.concat(subDirectoryDocuments);
    }
  }
  return documents;
};


export const populateEmbeddingsTables = async(dir) => {
  await deleteTables();
  const documents = await walkDirectory(dir);
  await Promise.all(documents.map(async (doc) => {
    await chunkDoc(doc); 
  })); 
};
