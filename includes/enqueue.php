<?php
if (!defined('ABSPATH')) exit;

function snsc_enqueue_assets() {
    // Styles
    wp_enqueue_style('snsc-styles', plugins_url('assets/styles.css', dirname(__FILE__)));
    wp_enqueue_style('snsc-popup-styles', plugins_url('assets/styles/popup.css', dirname(__FILE__)));
    
    // jQuery
    wp_enqueue_script('jquery');
    
    // jsPDF
    wp_enqueue_script(
        'jspdf',
        'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
        ['jquery'],
        '2.5.1',
        true
    );
    
    // Custom scripts
    wp_enqueue_script(
        'snsc-calculator',
        plugins_url('assets/scripts/calculator.js', dirname(__FILE__)),
        ['jquery'],
        '1.0.0',
        true
    );
    
    wp_enqueue_script(
        'snsc-form-handler',
        plugins_url('assets/scripts/form-handler.js', dirname(__FILE__)),
        ['jquery', 'jspdf', 'snsc-calculator'],
        '1.0.0',
        true
    );

    // Localize script
    wp_localize_script('snsc-form-handler', 'snsc', [
        'ajaxurl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('snsc_nonce')
    ]);
}
add_action('wp_enqueue_scripts', 'snsc_enqueue_assets');