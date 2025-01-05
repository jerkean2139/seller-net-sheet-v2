// Email validation using RFC 5322 standard
export function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
}

// Phone number validation (North American format)
export function isValidPhone(phone) {
    const phoneRegex = /^\+?1?\s*[-.]?\s*\(?([0-9]{3})\)?\s*[-.]?\s*([0-9]{3})\s*[-.]?\s*([0-9]{4})$/;
    return phoneRegex.test(phone);
}

// Name validation (letters, spaces, hyphens, and apostrophes)
export function isValidName(name) {
    const nameRegex = /^[a-zA-Z\s'-]+$/;
    return nameRegex.test(name);
}

// File type validation for images
export function isValidImageFile(file) {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    return file && validTypes.includes(file.type);
}