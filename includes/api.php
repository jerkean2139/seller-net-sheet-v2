<?php
if (!defined('ABSPATH')) exit;

function snsc_register_pdf_endpoint() {
    register_rest_route('snsc/v1', '/generate-pdf', [
        'methods' => 'POST',
        'callback' => 'snsc_generate_pdf',
        'permission_callback' => '__return_true',
    ]);
}
add_action('rest_api_init', 'snsc_register_pdf_endpoint');

function snsc_generate_pdf(WP_REST_Request $request) {
    $data = $request->get_json_params();
    return rest_ensure_response([
        'message' => 'PDF generated successfully', 
        'data' => $data
    ]);
}