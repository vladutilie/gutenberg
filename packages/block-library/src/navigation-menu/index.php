<?php
/**
 * Server-side rendering of the `core/navigation-menu` block.
 *
 * @package gutenberg
 */

/**
 * Renders the `core/navigation-menu` block on server.
 *
 * @param array $attributes The block attributes.
 * @param array $content The saved content.
 * @param array $block The parsed block.
 *
 * @return string Returns the post content with the legacy widget added.
 */
function render_block_navigation_menu( $attributes, $content, $block ) {
	$items = setup_block_nav_items( $block );
	$args  = (object) array(
		'before'          => '',
		'after'           => '',
		'link_before'     => '',
		'link_after'      => '',
		'theme_location'  => 'block',
	);

	return '<nav class="wp-block-navigation-menu"><ul class="menu">' . walk_nav_menu_tree( $items, 0, $args ) . '</ul></nav>';
}

/**
 * Prepares menu items to be used in Walker_Nav_Menu.
 *
 * @param array $block The parsed block.
 * @return array Menu items
 */
function setup_block_nav_items( $block ) {
	$nav_menu_items = array();
	$nav_menu_item  = array(
		'post_type' => 'nav_menu_item',
		'post_content' => '',
		'post_excerpt' => '',
		'current' => false,
	);

	foreach ( $block['innerBlocks'] as $index => $inner_block ) {
		$nav_menu_item['ID']         = $index;
		$nav_menu_item['post_title'] = $inner_block['attrs']['label'];
		$nav_menu_item['url']        = $inner_block['attrs']['destination'];

		$nav_menu_items[] = (object) $nav_menu_item;
	}

	return array_map( 'wp_setup_nav_menu_item', $nav_menu_items );
}

/**
 * Register the navigation menu block.
 *
 * @uses render_block_navigation_menu()
 */
function register_block_core_navigation_menu() {
	register_block_type(
		'core/navigation-menu',
		array(
			'category'        => 'layout',
			'attributes'      => array(
				'automaticallyAdd' => array(
					'type'    => 'boolean',
					'default' => false,
				),
			),
			'render_callback' => 'render_block_navigation_menu',
		)
	);
}

add_action( 'init', 'register_block_core_navigation_menu' );
