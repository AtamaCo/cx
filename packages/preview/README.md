# @atamaco/preview

```js
window.postMessage({
  "type": "componentData",
  payload: {
    "components": [
    {
      "type": "banner",
      "id": "123",
      "properties": {
        "image": "https://api.lorem.space/image/shoes?w=1000&h=700&hash=123",
        "title": "Awesome shoes",
        "subtitle": "Get them NOW or never",
        "description": "New shoes are new because they were newly made to be newly worn."
      }
    },
    {
      "type": "banner",
      "id": "456",
      "properties": {
        "title": "Eco Sandals",
        "subtitle": "Summer shoes",
        "description": "The collection features formal and casual comfort shoes with a Danish design focus. Made from premium leathers and comfort.",
        "image": "https://api.lorem.space/image/shoes?w=1000&h=700&hash=456"
      }
    },
    {
      "type": "card",
      "id": "789",
      "properties": {
        "image": "https://api.lorem.space/image/car?w=500&h=500&hash=789",
        "title": "The NEW one",
        "titleLevel": 1,
        "description": "Faster better awesome super duper"
      }
    }
  ]
  }
});
```