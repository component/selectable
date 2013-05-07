
# selectable

  Selectable DOM elements.

  ![dom element selection js component](http://i.cloudup.com/iZqb9fzgccE.png)

## Installation

    $ component install component/selectable

## Example

```html
<ul id="pets">
  <li data-name="tobi">Tobi</li>
  <li data-name="loki">Loki</li>
  <li data-name="jane">Jane</li>
  <li data-name="abby">Abby</li>
</ul>

<script>
  var selectable = require('selectable');
  var selection = selectable('#pets > li');

  selection.on('change', function(e){
    for (var i = 0; i < e.selected.length; i++) {
      console.log(e.selected[i].getAttribute('data-name'));
    }
  });
</script>
```

## API

### Selectable(selector, el)

  Make elements with the given `selector` selectable, with optional context `el`.

## License

  MIT
