<?php
/*
Plugin Name: Seller Net Sheet Calculator
Description: A calculator for Seller Net Sheet with PDF generation capabilities
Version: 1.0
Author: Jeremy Kean-Kean On Biz
*/

// Prevent direct access
if (!defined('ABSPATH')) exit;

// Include required files
require_once plugin_dir_path(__FILE__) . 'includes/enqueue.php';
require_once plugin_dir_path(__FILE__) . 'includes/shortcode.php';
require_once plugin_dir_path(__FILE__) . 'includes/api.php';

// Initialize the plugin
add_action('init', 'snsc_init');

function snsc_init() {
    // Add shortcode
    add_shortcode('seller_net_sheet', 'snsc_shortcode');
    
    // Register assets
    add_action('wp_enqueue_scripts', 'snsc_enqueue_assets');
    
    // Register API endpoints
    add_action('rest_api_init', function() {
        register_rest_route('snsc/v1', '/generate-pdf', [
            'methods' => 'POST',
            'callback' => 'snsc_generate_pdf',
            'permission_callback' => '__return_true',
        ]);
    });
}