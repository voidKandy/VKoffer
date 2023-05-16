import dotenv from 'dotenv';
import { promptUser } from '../utils/promptUser.js'; 
import { generateEmbedding } from './embeddingsModule.js';
import { createClient } from '@supabase/supabase-js'
require('dotenv').config()

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const fileNameFromParentID = async(parent_file_id) => { 
  const { data, error } = await supabase
    .from('file')
    .select('*')
    .eq('id', parent_file_id)
  

  const filename = data[0].name;
  const filepath = data[0].path;


  return [filename, filepath];
}

export const queryEmbeddings = async(query) => {
  const query_embedding = (await generateEmbedding(query))[0].embedding;
  const { error: matchError, data: fileSections } = await supabase
  .rpc('match_file_sections', {
      query_embedding: query_embedding,
      match_threshold: 0.78,
      match_count: 10,
      min_content_length: 50,
    }
  );
  const contextText = [];

  await Promise.all(fileSections.map((section) => {
    return fileNameFromParentID(section.parent_file_id)
      .then(([filename, filepath]) => {
        let content = section.content.replace(/\n/g, " ");
        const contextSection = {
          file: filename,
          path: filepath,
          content: content
        }
        contextText.push(contextSection);
      })
      .catch((error) => {
        console.error(error);
      });
  }));
  return contextText;
};

