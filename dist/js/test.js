import React from 'react';
import ReactDOM from 'react-dom';
import Masonry from 'react-masonry-component';

var masonryOptions = {
    transitionDuration: 0
};

var Gallery = React.createClass({
    render: function () {
        var childElements = this.props.elements.map(function(element){
           return (
                <li className="image-element-class">
                    <img src={element.src} />
                </li>
            );
        });

        return (
            <Masonry
                className={'my-gallery-class'} // default ''
                elementType={'ul'} // default 'div'
                options={masonryOptions} // default {}
                disableImagesLoaded={false} // default false
                updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
            >
                {childElements}
            </Masonry>
        );
    }
});

var images = ['http://placehold.it/200x90', 'http://placehold.it/200x200', 'http://placehold.it/200x350', 'http://placehold.it/200x150']

ReactDOM.render( <Gallery user={images} />, document.getElementById('root') );