/* demo-my-mock-responses.js */
/* node demo-my-mock-responses.js */
/* curl -v -X GET 'http://localhost:2080/index.php?r=j&username=michael' */ 

var mockServer = require('mockserver-client'),
    mockServerClient = mockServer.mockServerClient,
    proxyClient = mockServer.proxyClient;

var local = mockServerClient('localhost', 2080),
    localProxy = proxyClient('localhost', 2090);

local.reset();

local.mockSimpleResponse('/api/demo', {name:'value'}, 203);

local.mockAnyResponse({
  httpRequest: {
    method: 'GET',
    path: '/index.php',
    queryStringParameters: [
      { 'name': 'r', 'values': ['j'] },
      {
        'name': 'username', 
        'values': ['michael']
      },
    ],
  },

  'httpResponse': {
    'statusCode': 200,
    'body': JSON.stringify({"username": "michael"}),
    'delay': {
      'timeUnit': 'MILLISECONDS',
      'value': 250
    }
  },
  'times': {
    'remainingTimes': 1,
    'unlimited':true 
  }
});

local.mockAnyResponse({
  httpRequest: {
    method: 'GET',
    path: '/index.php',
    queryStringParameters: [
      {
        'name': 'r', 
        'values': ['city/list']
      },
    ],
  },
  httpForward: {
    host: 'www.xxtao.com',
    port: 80,
    schema: "HTTP"
  },
  times: {
    remainingTimes: 1,
    unlimited: true
  }
});

local.mockAnyResponse({
  httpRequest: {
    method: 'GET',
    path: '/index.php',
    queryStringParameters: [
      {
        'name': 'r', 
        'values': ['tips/list']
      },
    ],
  },
  httpForward: {
    host: 'www.xxtao.com',
    port: 80,
    schema: "HTTP"
  },
  times: {
    remainingTimes: 1,
    unlimited: true
  }
});

local.mockAnyResponse({
  'httpRequest': {
    'method': 'POST',
    'path': '/api/postdemo',
    'queryStringParameters': [
      { 
        'name': 'test',
        'values': ['true']
      }
    ],
    'body': {
      'type': "STRING", 'value': 'someBody'
    }
  },

  'httpResponse': {
    'statusCode': 200,
    'body': JSON.stringify({"name": "value"}),
    'delay': {
      'timeUnit': 'MILLISECONDS',
      'value': 250
    }
  },
  'times': {
    'remainingTimes': 1,
    'unlimited':true 
  }
});

