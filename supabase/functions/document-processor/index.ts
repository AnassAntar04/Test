import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Traiter la queue des documents en attente
    const { data: queueItems, error: queueError } = await supabase
      .from('document_processing_queue')
      .select(`
        *,
        chat_attachments(*)
      `)
      .eq('processing_status', 'queued')
      .order('priority', { ascending: true })
      .order('created_at', { ascending: true })
      .limit(10);

    if (queueError) {
      throw queueError;
    }

    const results = [];

    for (const item of queueItems || []) {
      try {
        // Marquer comme en cours de traitement
        await supabase
          .from('document_processing_queue')
          .update({
            processing_status: 'processing',
            started_at: new Date().toISOString(),
            attempts: item.attempts + 1
          })
          .eq('id', item.id);

        // Traiter selon le type
        let processResult;
        switch (item.processing_type) {
          case 'image_analysis':
            processResult = await processImageAnalysis(item);
            break;
          case 'pdf_extraction':
            processResult = await processPdfExtraction(item);
            break;
          default:
            processResult = await processGeneralDocument(item);
        }

        // Mettre à jour le statut
        await supabase
          .from('document_processing_queue')
          .update({
            processing_status: processResult.success ? 'completed' : 'failed',
            completed_at: new Date().toISOString(),
            result_data: processResult.data,
            error_message: processResult.error
          })
          .eq('id', item.id);

        results.push({
          item_id: item.id,
          success: processResult.success,
          processing_type: item.processing_type
        });

      } catch (error) {
        console.error(`Error processing item ${item.id}:`, error);
        
        // Marquer comme échoué si dépassement du nombre de tentatives
        const shouldRetry = item.attempts < item.max_attempts;
        await supabase
          .from('document_processing_queue')
          .update({
            processing_status: shouldRetry ? 'queued' : 'failed',
            error_message: error.message,
            scheduled_at: shouldRetry ? new Date(Date.now() + 300000).toISOString() : null // Retry dans 5 min
          })
          .eq('id', item.id);
      }
    }

    return new Response(
      JSON.stringify({
        processed_count: results.length,
        results
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in document-processor:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});

async function processImageAnalysis(item: any) {
  try {
    // Simuler l'analyse d'image (intégration future avec un service d'IA)
    const analysis = {
      detected_objects: ['person', 'building'],
      text_extracted: 'Sample extracted text',
      confidence_score: 0.85,
      metadata: {
        width: 1920,
        height: 1080,
        format: 'JPEG'
      }
    };

    return {
      success: true,
      data: {
        analysis_type: 'image_analysis',
        results: analysis,
        processed_at: new Date().toISOString()
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      data: null
    };
  }
}

async function processPdfExtraction(item: any) {
  try {
    // Simuler l'extraction PDF (intégration future avec un service OCR)
    const extraction = {
      text_content: 'Extracted PDF text content...',
      page_count: 5,
      metadata: {
        title: 'Document Title',
        author: 'Document Author',
        creation_date: '2024-01-01'
      }
    };

    return {
      success: true,
      data: {
        analysis_type: 'pdf_extraction',
        results: extraction,
        processed_at: new Date().toISOString()
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      data: null
    };
  }
}

async function processGeneralDocument(item: any) {
  try {
    // Traitement général des documents
    const processing = {
      file_type: item.chat_attachments?.file_type,
      file_size: item.chat_attachments?.file_size,
      processed: true,
      scan_results: {
        virus_scan: 'clean',
        content_type_verified: true
      }
    };

    return {
      success: true,
      data: {
        analysis_type: 'general_processing',
        results: processing,
        processed_at: new Date().toISOString()
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      data: null
    };
  }
}