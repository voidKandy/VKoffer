import dotenv from 'dotenv';
import { promptUser } from '../utils/promptUser.js'; 
import { generateEmbedding } from './embeddingsModule.js';
import { createClient } from '@supabase/supabase-js'
require('dotenv').config()

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export const queryEmbeddings = async(query) => {
// console.log(supabase)
  const query_embedding = (await generateEmbedding(query))[0].embedding;
  const { error: matchError, data: fileSections } = await supabase
  .rpc('match_file_sections', {
      query_embedding: query_embedding,
      match_threshold: 0.78,
      match_count: 10,
      min_content_length: 50,
    }
  );
  console.log(fileSections, matchError)
}
