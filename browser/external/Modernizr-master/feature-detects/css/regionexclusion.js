/*!
{
  "name": "CSS Regions & Exclusion",
  "caniuse": "css-regions-exclusions",
  "authors": ["CJ Gammon"],
  "property": "regionexclusion",
  "tags": ["css"],
  "notes": [{
    "name": "W3C Specification",
    "href": "http://www.w3.org/TR/css3-regions/"
  }]
}
!*/
define(['Modernizr', 'createElement', 'docElement', 'prefixed', 'testStyles'], function( Modernizr, createElement, docElement, prefixed, testStyles ) {
    // http://www.w3.org/TR/css3-exclusions
    // http://www.w3.org/TR/css3-exclusions/#shapes
    // Examples: http://html.adobe.com/webstandards/cssexclusions
    // Separate test for CSS shapes as WebKit has just implemented this alone
        Modernizr.addTest('regionexclusion', function () {

            var prefixedFlowInto = prefixed('flowInto'),
                prefixedFlowFrom = prefixed('flowFrom'),
                prefixedShape = prefixed('shapeOutside'),
                leftOffset,
                container,
                content,
                exclusion,
                tracker;

            if (!prefixedFlowInto)
                return false;
            if (!prefixedFlowFrom)
                return false;
            if (!prefixedShape)
                return false;

            prefixedFlowInto = prefixedFlowInto.replace(/([A-Z])/g, function (str, m1) { return '-' + m1.toLowerCase(); }).replace(/^ms-/, '-ms-');
            prefixedFlowFrom = prefixedFlowFrom.replace(/([A-Z])/g, function (str, m1) { return '-' + m1.toLowerCase(); }).replace(/^ms-/, '-ms-');
            prefixedShape = prefixedShape.replace(/([A-Z])/g, function (str, m1) { return '-' + m1.toLowerCase(); }).replace(/^ms-/, '-ms-');


            container = createElement('div');
            content = createElement('div');
            exclusion = createElement('div');

            content.style.cssText = '' + prefixedFlowInto + ': testflow; font-size: 16px; font-family: serif;';
            content.innerHTML = '<b>hello</b>this is some body copy.  this is <span id="testtracker">some</span> body copy.  this is some body copy.  this is some body copy.  this is some body copy.  this is some body copy.  this is some body copy.  this is some body copy.';

            exclusion.style.cssText = 'position: relative; display: block; width: 14em; height: 200px; ' + prefixedFlowFrom + ': testflow; ' + prefixedShape + ': polygon(0 0, 70% 0, 70% 100%, 0 100%);';

            container.appendChild(exclusion);
            container.appendChild(content);
            docElement.appendChild(container);

            tracker = document.getElementById('testtracker');
            leftOffset = tracker.offsetLeft;

            docElement.removeChild(container);
            exclusion = content = container = tracker = undefined;

            return (leftOffset !== 0);
        });
});
