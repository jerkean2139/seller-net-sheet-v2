<?php
if (!defined('ABSPATH')) exit;

function snsc_shortcode() {
    ob_start();
    ?>
    <div class="calculator-container">
        <div class="calculator-grid">
            <?php 
            include plugin_dir_path(dirname(__FILE__)) . 'templates/calculator-form.php';
            include plugin_dir_path(dirname(__FILE__)) . 'templates/calculator-output.php';
            include plugin_dir_path(dirname(__FILE__)) . 'templates/popup-form.php';
            ?>
        </div>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('seller_net_sheet', 'snsc_shortcode');