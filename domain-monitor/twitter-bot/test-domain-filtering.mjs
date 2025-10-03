import OpportunityAnalyzer from './opportunity-analyzer.mjs';
import EnhancedEventProcessor from './enhanced-event-processor.mjs';

// Test data with mixed valid and invalid domain names
const testEvents = [
  {
    id: 1,
    name: 'example.com',
    type: 'NAME_TOKEN_MINTED',
    event_data: { price: 1000 },
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Event-12345',
    type: 'NAME_TOKEN_SOLD',
    event_data: { price: 5000 },
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    name: '123456',
    type: 'NAME_TOKEN_TRANSFERRED',
    event_data: { price: 2000 },
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    name: 'premium.io',
    type: 'NAME_TOKEN_BURNED',
    event_data: {},
    created_at: new Date().toISOString()
  },
  {
    id: 5,
    name: 'invalid-domain',
    type: 'NAME_TOKEN_MINTED',
    event_data: {},
    created_at: new Date().toISOString()
  },
  {
    id: 6,
    name: 'short.co',
    type: 'NAME_TOKEN_MINTED',
    event_data: {},
    created_at: new Date().toISOString()
  }
];

async function testDomainFiltering() {
  console.log('🧪 Testing Domain Name Filtering\n');
  
  // Test Enhanced Event Processor
  console.log('1. Testing Enhanced Event Processor...');
  const eventProcessor = new EnhancedEventProcessor();
  
  // Test domain name validation
  console.log('   Testing isValidDomainName method:');
  const testNames = [
    'example.com',
    'Event-12345',
    '123456',
    'premium.io',
    'invalid-domain',
    'short.co',
    'valid-domain.com',
    'a.b',
    'very-long-domain-name-that-should-be-invalid.com'
  ];
  
  testNames.forEach(name => {
    const isValid = eventProcessor.isValidDomainName(name);
    console.log(`   ${name}: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
  });
  
  // Test event processing
  console.log('\n   Testing event processing with test data:');
  const { opportunities } = await eventProcessor.processEvents();
  console.log(`   Found ${opportunities.length} valid opportunities`);
  
  opportunities.forEach(opp => {
    console.log(`   - ${opp.domain} (${opp.category})`);
  });
  
  // Test Opportunity Analyzer
  console.log('\n2. Testing Opportunity Analyzer...');
  const opportunityAnalyzer = new OpportunityAnalyzer();
  
  // Test domain name validation
  console.log('   Testing isValidDomainName method:');
  testNames.forEach(name => {
    const isValid = opportunityAnalyzer.isValidDomainName(name);
    console.log(`   ${name}: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
  });
  
  // Test opportunity analysis (this would normally query the database)
  console.log('\n   Testing opportunity analysis...');
  console.log('   (Note: This would normally query the database)');
  
  console.log('\n✅ Domain filtering tests completed!');
  console.log('\n📋 Summary:');
  console.log('- Event IDs (Event-12345, 123456) should be filtered out');
  console.log('- Invalid domain names (invalid-domain) should be filtered out');
  console.log('- Valid domain names (example.com, premium.io, short.co) should be kept');
  console.log('- Only valid domain names should be used for tweets');
}

// Run the test
testDomainFiltering().catch(console.error);
