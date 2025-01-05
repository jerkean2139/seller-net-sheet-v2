<div id="popup-modal" class="popup hidden">
    <div class="popup-content">
        <h2>Save/Print Details</h2>
        <form id="popup-form">
            <!-- Basic Info -->
            <div class="form-group">
                <label for="first-name">First Name:</label>
                <input type="text" id="first-name" name="first_name" required>
            </div>
            
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>
            </div>

            <!-- Agent Question (at bottom) -->
            <div class="form-group agent-section">
                <label>Are you a real estate agent?</label>
                <div class="radio-group">
                    <label class="radio-label">
                        <input type="radio" name="is_agent" value="no" checked> No
                    </label>
                    <label class="radio-label">
                        <input type="radio" name="is_agent" value="yes"> Yes
                    </label>
                </div>
            </div>

            <!-- Conditional Logo Question -->
            <div id="logo-question" class="form-group hidden">
                <label>Would you like to add your Logo, Image, and Contact Info?</label>
                <div class="radio-group">
                    <label class="radio-label">
                        <input type="radio" name="add_logo" value="no" checked> No
                    </label>
                    <label class="radio-label">
                        <input type="radio" name="add_logo" value="yes"> Yes
                    </label>
                </div>
            </div>

            <!-- Upload Fields -->
            <div id="upload-fields" class="form-group hidden">
                <div class="form-group">
                    <label for="agent-phone">Phone Number:</label>
                    <input type="tel" id="agent-phone" name="agent_phone">
                </div>

                <div class="form-group">
                    <label for="agent-logo">Upload Your Logo:</label>
                    <input type="file" id="agent-logo" name="agent_logo" accept="image/*">
                </div>

                <div class="form-group">
                    <label for="agent-image">Upload Your Picture:</label>
                    <input type="file" id="agent-image" name="agent_image" accept="image/*">
                </div>
            </div>

            <div class="form-actions">
                <button type="submit" class="submit-btn">Generate PDF</button>
                <button type="button" class="cancel-btn" id="close-popup">Cancel</button>
            </div>
        </form>
    </div>
</div>