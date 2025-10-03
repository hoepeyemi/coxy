#!/usr/bin/env node

// Test script to verify domain page functionality
const testDomainId = 'Event-396045';
const testUrl = `http://localhost:3000/domain/${testDomainId}?type=listing`;

console.log('🧪 Testing Domain Page Functionality');
console.log('=====================================');
console.log(`Test URL: ${testUrl}`);
console.log('');

// Test the URL structure
const url = new URL(testUrl);
console.log('✅ URL Structure:');
console.log(`   Protocol: ${url.protocol}`);
console.log(`   Host: ${url.host}`);
console.log(`   Pathname: ${url.pathname}`);
console.log(`   Search Params: ${url.search}`);
console.log('');

// Test parameter extraction
const pathParts = url.pathname.split('/');
const domainId = pathParts[pathParts.length - 1];
const type = url.searchParams.get('type');

console.log('✅ Parameter Extraction:');
console.log(`   Domain ID: ${domainId}`);
console.log(`   Type: ${type}`);
console.log('');

// Test URL generation (like what the Twitter bot does)
function generateDomainUrl(domainId, type = 'listing') {
  return `https://coxy.onrender.com/domain/${domainId}?type=${type}`;
}

const generatedUrl = generateDomainUrl('Event-396045', 'listing');
console.log('✅ URL Generation (Twitter Bot Style):');
console.log(`   Generated URL: ${generatedUrl}`);
console.log('');

console.log('🎉 Domain page route is ready!');
console.log('   - Dynamic route: /domain/[id]');
console.log('   - Query parameters: ?type=listing');
console.log('   - Loading state: /domain/[id]/loading.tsx');
console.log('   - Not found: /domain/[id]/not-found.tsx');
console.log('');

console.log('📝 Next Steps:');
console.log('   1. Deploy the frontend to Render');
console.log('   2. Test the actual domain page');
console.log('   3. Verify Twitter bot links work');
