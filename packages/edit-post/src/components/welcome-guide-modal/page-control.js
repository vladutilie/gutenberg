/**
 * External dependencies
 */
import { times } from 'lodash';

/**
 * WordPress dependencies
 */
import { IconButton } from '@wordpress/components';

export default function PageControl( { currentPage, numberOfPages, setCurrentPage } ) {
	return (
		<div>
			{ times( numberOfPages, ( page ) => (
				<IconButton
					key={ page }
					icon={ page === currentPage ? 'foo' : 'bar' }
					onClick={ () => setCurrentPage( page ) }
				/>
			) ) }
		</div>
	);
}
