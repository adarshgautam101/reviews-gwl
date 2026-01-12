const XLSX = require('xlsx');
const path = require('path');

const headers = ['Product ID', 'Rating', 'Author', 'Email', 'Title', 'Content', 'Status', 'Created At'];

const data = [
    {
        'Product ID': 'gid://shopify/Product/123456789',
        'Rating': 5,
        'Author': 'Test User 1',
        'Email': 'test1@example.com',
        'Title': 'Excellent Product',
        'Content': 'This is a great product, I love it!',
        'Status': 'approved',
        'Created At': new Date().toISOString()
    },
    {
        'Product ID': 'gid://shopify/Product/123456789',
        'Rating': 4,
        'Author': 'Test User 2',
        'Email': 'test2@example.com',
        'Title': 'Good Value',
        'Content': 'Good value for money.',
        'Status': 'pending',
        'Created At': new Date().toISOString()
    },
    {
        'Product ID': 'gid://shopify/Product/987654321',
        'Rating': 3,
        'Author': 'Test User 3',
        'Email': 'test3@example.com',
        'Title': 'Average',
        'Content': 'It is okay, but could be better.',
        'Status': 'approved',
        'Created At': new Date().toISOString()
    },
    {
        'Product ID': 'gid://shopify/Product/987654321',
        'Rating': 1,
        'Author': 'Test User 4',
        'Email': 'test4@example.com',
        'Title': 'Not satisfied',
        'Content': 'I am not satisfied with this product.',
        'Status': 'rejected',
        'Created At': new Date().toISOString()
    }
];

// Create a worksheet
const ws = XLSX.utils.json_to_sheet(data, { header: headers });

// Create a workbook
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Reviews');

// Write to file
const filePath = path.join(__dirname, 'test_reviews.xlsx');
XLSX.writeFile(wb, filePath);

console.log(`Excel file created at: ${filePath}`);
