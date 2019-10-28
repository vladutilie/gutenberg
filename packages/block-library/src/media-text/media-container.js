/**
 * WordPress dependencies
 */
import { IconButton, ResizableBox, Toolbar, withNotices } from '@wordpress/components';
import {
	BlockControls,
	BlockIcon,
	MediaPlaceholder,
	MediaUpload,
} from '@wordpress/block-editor';
import {
 	LEFT,
 	RIGHT,
 	UP,
 	DOWN,
 	BACKSPACE,
 	ENTER,
 } from '@wordpress/keycodes';
import { Component, URLPopover, LinkEditor, LinkViewer } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import { withDispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import icon from './media-container-icon';

/**
 * Constants
 */
const ALLOWED_MEDIA_TYPES = [ 'image', 'video' ];

export function imageFillStyles( url, focalPoint ) {
	return url ?
		{
			backgroundImage: `url(${ url })`,
			backgroundPosition: focalPoint ? `${ focalPoint.x * 100 }% ${ focalPoint.y * 100 }%` : `50% 50%`,
		} :
		{};
}

const stopPropagation = ( event ) => {
	event.stopPropagation();
};

const stopPropagationRelevantKeys = ( event ) => {
	if ( [ LEFT, DOWN, RIGHT, UP, BACKSPACE, ENTER ].indexOf( event.keyCode ) > -1 ) {
		// Stop the key event from propagating up to ObserveTyping.startTypingInTextField.
		event.stopPropagation();
	}
};

class MediaContainer extends Component {
	constructor() {
		super( ...arguments );
		this.onUploadError = this.onUploadError.bind( this );
		this.state = {
			showEditURLInput: false,
			mediaURLValue: false,
			showMediaLink: false,
		};
	}

	onUploadError( message ) {
		const { noticeOperations } = this.props;
		noticeOperations.removeAllNotices();
		noticeOperations.createErrorNotice( message );
	}
	
	renderToolbarLinkButton() {
		return (
			<>
				<IconButton
					icon="admin-links"
					className="components-toolbar__control"
					label={ url ? __( 'Edit link' ) : __( 'Insert link' ) }
					aria-expanded={ isOpen }
					onClick={ this.setState( { showMediaLink: ! showMediaLink } ) }
				/>
				{ this.showMediaLink &&
					<Popover>
						{ renderLinkEdit() }
					</Popover>
				}
			</>
		);	
	}
	
	renderLinkEdit() {
		let urlInputUIContent;
	 	if ( showEditURLInput ) {
	 		urlInputUIContent = ( <LinkEditor
	 			onKeyDown={ this.stopPropagationRelevantKeys }
	 			onKeyPress={ this.stopPropagation }
	 			value={ this.state.mediaURLValue }
	 			isFullWidthInput={ true }
	 			hasInputBorder={ true }
	 			onChangeInputValue={ ( mediaURLValue ) => ( this.setState( { mediaURLValue } ) ) }
	 			onSubmit={ ( event ) => {
	 				event.preventDefault();
	 				onSelectURL( this.state.mediaURLValue );
	 				this.setState( { showEditURLInput: ! showEditURLInput } );
	 			} }
	 		/> );
	 	} else {
	 		urlInputUIContent = ( <LinkViewer
	 			isFullWidth={ true }
	 			className="editor-format-toolbar__link-container-content block-editor-format-toolbar__link-container-content"
	 			url={ mediaURLValue }
	 			onEditLinkClick={ () => ( this.setState( { showEditURLInput: ! showEditURLInput } ) ) }
	 		/> );
	 	}

	}

	renderToolbarEditButton() {
		const { mediaId, onSelectMedia } = this.props;
		return (
			<BlockControls>
				<Toolbar>
					<MediaUpload
						onSelect={ onSelectMedia }
						allowedTypes={ ALLOWED_MEDIA_TYPES }
						value={ mediaId }
						render={ ( { open } ) => (
							<IconButton
								className="components-toolbar__control"
								label={ __( 'Edit media' ) }
								icon="edit"
								onClick={ open }
							/>
						) }
					/>
				</Toolbar>
			</BlockControls>
		);
	}

	renderImage() {
		const { mediaAlt, mediaUrl, className, imageFill, focalPoint } = this.props;
		const backgroundStyles = imageFill ? imageFillStyles( mediaUrl, focalPoint ) : {};
		return (
			<>
				<figure className={ className } style={ backgroundStyles }>
					<img src={ mediaUrl } alt={ mediaAlt } />
				</figure>
			</>
		);
	}

	renderVideo() {
		const { mediaUrl, className } = this.props;
		return (
			<>
				{ this.renderToolbarEditButton() }
				<figure className={ className }>
					<video controls src={ mediaUrl } />
				</figure>
			</>
		);
	}

	renderPlaceholder() {
		const { onSelectMedia, className, noticeUI } = this.props;
		return (
			<MediaPlaceholder
				icon={ <BlockIcon icon={ icon } /> }
				labels={ {
					title: __( 'Media area' ),
				} }
				className={ className }
				onSelect={ onSelectMedia }
				accept="image/*,video/*"
				allowedTypes={ ALLOWED_MEDIA_TYPES }
				notices={ noticeUI }
				onError={ this.onUploadError }
			/>
		);
	}

	render() {
		const { mediaPosition, mediaUrl, mediaType, mediaWidth, commitWidthChange, onWidthChange, toggleSelection } = this.props;
		if ( mediaType && mediaUrl ) {
			const onResizeStart = () => {
				toggleSelection( false );
			};
			const onResize = ( event, direction, elt ) => {
				onWidthChange( parseInt( elt.style.width ) );
			};
			const onResizeStop = ( event, direction, elt ) => {
				toggleSelection( true );
				commitWidthChange( parseInt( elt.style.width ) );
			};
			const enablePositions = {
				right: mediaPosition === 'left',
				left: mediaPosition === 'right',
			};

			let mediaElement = null;
			switch ( mediaType ) {
				case 'image':
					mediaElement = this.renderImage();
					break;
				case 'video':
					mediaElement = this.renderVideo();
					break;
			}
			return (
				<>
					<BlockControls>
						{ this.renderToolbarEditButton() }
					</BlockControls>
	
					<ResizableBox
						className="editor-media-container__resizer"
						size={ { width: mediaWidth + '%' } }
						minWidth="10%"
						maxWidth="100%"
						enable={ enablePositions }
						onResizeStart={ onResizeStart }
						onResize={ onResize }
						onResizeStop={ onResizeStop }
						axis="x"
					>
						{ mediaElement }
					</ResizableBox>
				</>
			);
		}
		return this.renderPlaceholder();
	}
}

export default compose( [
	withDispatch( ( dispatch ) => {
		const { toggleSelection } = dispatch( 'core/block-editor' );

		return {
			toggleSelection,
		};
	} ),
	withNotices,
] )( MediaContainer );
