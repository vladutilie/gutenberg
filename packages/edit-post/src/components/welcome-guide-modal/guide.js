/**
 * WordPress dependencies
 */
import { useState, Children } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import PageControl from './page-control';

function Guide( { onRequestClose, children } ) {
	const [ currentPage, setCurrentPage ] = useState( 0 );

	const numberOfPages = Children.count( children );
	const canGoBack = currentPage > 0;
	const canGoForward = currentPage < numberOfPages - 1;

	const goBack = () => {
		setCurrentPage( currentPage - 1 );
	};

	const goForward = () => {
		setCurrentPage( currentPage + 1 );
	};

	return (
		<>
			{ children[ currentPage ] }
			<div>
				{ canGoBack && (
					<Button onClick={ goBack }>{ __( 'Previous' ) }</Button>
				) }
				<PageControl
					currentPage={ currentPage }
					numberOfPages={ numberOfPages }
					setCurrentPage={ setCurrentPage }
				/>
				{ canGoForward && (
					<Button onClick={ goForward }>{ __( 'Next' ) }</Button>
				) }
				{ ! canGoForward && (
					<Button onClick={ onRequestClose }>{ __( 'Get started' ) }</Button>
				) }
			</div>
		</>
	);
}

function Page( { children } ) {
	return (
		<div>
			{ children }
		</div>
	);
}

Guide.Page = Page;

export default Guide;
