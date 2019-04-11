import StarRating from 'Components/StarRating';
import {get} from 'lodash';
import React from 'react';
import LinesEllipsis from 'react-lines-ellipsis';
import responsiveHOC from 'react-lines-ellipsis/lib/responsiveHOC';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {updateFilters} from 'Store/actions';

const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis);

const Card = ({place = {}, loadReviews}) => {
    const name = place.name;
    const id = place.id;
    const imgSrc = get(place, 'photos[0]');
    const rating = place.rating;
    const price = place.price;
    const category = get(place, 'categories[0].title', 'Unknown').toUpperCase();
    const isOpen = !get(place, 'is_closed', true);

    return (
        <div className='card'>
            <img className='image' src={imgSrc} alt={name}/>
            <div className='card-details'>
                <ResponsiveEllipsis className='name' text={name} maxLine={2} trimRight basedOn='letters'/>
                <StarRating rating={rating}/>
                <div className='card-info'>
                    <div className='category' style={{overflow: 'ellipsis'}}>{category}</div>
                    <div className='separator'>•</div>
                    <div className='price'>{price}</div>
                    {isOpen
                        ? <div className='status open'>OPEN</div>
                        : <div className='status closed'>CLOSED</div>
                    }
                </div>
                <div className='button learn-more'>
                    <Link to={`/detail/${encodeURIComponent(id)}`} className='text' onClick={loadReviews}>
                        Learn More <span className='arrow'>→</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default connect(null, {
    updateFilters,
})(Card);
