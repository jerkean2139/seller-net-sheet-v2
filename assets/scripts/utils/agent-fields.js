import $ from 'jquery';

export function setupAgentFields() {
    // Handle agent selection
    $('input[name="is_agent"]').on('change', (e) => {
        const isAgent = $(e.target).val() === 'yes';
        $('#logo-question').toggleClass('hidden', !isAgent);
        
        if (!isAgent) {
            $('#upload-fields').addClass('hidden');
            $('input[name="add_logo"][value="no"]').prop('checked', true);
            resetUploadFields();
        }
    });

    // Handle logo selection
    $('input[name="add_logo"]').on('change', (e) => {
        const showUploadFields = $(e.target).val() === 'yes';
        $('#upload-fields').toggleClass('hidden', !showUploadFields);
        
        if (!showUploadFields) {
            resetUploadFields();
        }
    });
}

function resetUploadFields() {
    $('#agent-phone').val('');
    $('#agent-logo').val('');
    $('#agent-image').val('');
}