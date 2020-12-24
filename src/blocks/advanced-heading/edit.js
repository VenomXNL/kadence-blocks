/**
 * BLOCK: Kadence Advanced Heading
 *
 */
/* global kadence_blocks_params */
/**
 * Internal dependencies
 */
import map from 'lodash/map';
import classnames from 'classnames';
import TypographyControls from '../../typography-control';
import InlineTypographyControls from '../../inline-typography-control';
import AdvancedPopColorControl from '../../advanced-pop-color-control';
import InlineAdvancedPopColorControl from '../../advanced-inline-pop-color-control';
import KadenceColorOutput from '../../kadence-color-output';
import WebfontLoader from '../../fontloader';
import TextShadowControl from '../../text-shadow-control';
import KadenceRange from '../../kadence-range-control';
import ResponsiveMeasuremenuControls from '../../components/measurement/responsive-measurement-control';
import ResponsiveAlignControls from '../../components/align/responsive-align-control';
import ResponsiveRangeControls from '../../components/range/responsive-range-control';

/**
 * Block dependencies
 */
import HeadingLevelIcon from './heading-icons';
import HeadingStyleCopyPaste from './copy-paste-style';
import './markformat';

/**
 * Import Css
 */
import './editor.scss';
/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const { withSelect } = wp.data;
const { compose } = wp.compose;
const {
	createBlock,
} = wp.blocks;
const {
	InspectorControls,
	BlockControls,
	AlignmentToolbar,
	InspectorAdvancedControls,
	RichText,
} = wp.blockEditor;
const {
	Component,
	Fragment,
} = wp.element;
const {
	PanelBody,
	ButtonGroup,
	Button,
	ToolbarGroup,
	Dashicon,
	TabPanel,
	SelectControl,
	TextControl,
} = wp.components;
/**
 * Regular expression matching invalid anchor characters for replacement.
 *
 * @type {RegExp}
 */
const ANCHOR_REGEX = /[\s#]/g;

/**
 * This allows for checking to see if the block needs to generate a new ID.
 */
const ktadvancedheadingUniqueIDs = [];

class KadenceAdvancedHeading extends Component {
	constructor() {
		super( ...arguments );
		this.showSettings = this.showSettings.bind( this );
		this.saveShadow = this.saveShadow.bind( this );
		this.getPreviewSize = this.getPreviewSize.bind( this );
		this.state = {
			isVisible: false,
			user: ( kadence_blocks_params.userrole ? kadence_blocks_params.userrole : 'admin' ),
			settings: {},
			marginControl: 'individual',
			paddingControl: 'individual',
			markPaddingControls: 'individual',
		};
	}
	componentDidMount() {
		if ( ! this.props.attributes.uniqueID ) {
			const blockConfigObject = ( kadence_blocks_params.configuration ? JSON.parse( kadence_blocks_params.configuration ) : [] );
			if ( blockConfigObject[ 'kadence/advancedheading' ] !== undefined && typeof blockConfigObject[ 'kadence/advancedheading' ] === 'object' ) {
				Object.keys( blockConfigObject[ 'kadence/advancedheading' ] ).map( ( attribute ) => {
					this.props.attributes[ attribute ] = blockConfigObject[ 'kadence/advancedheading' ][ attribute ];
				} );
			}
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
			ktadvancedheadingUniqueIDs.push( '_' + this.props.clientId.substr( 2, 9 ) );
		} else if ( ktadvancedheadingUniqueIDs.includes( this.props.attributes.uniqueID ) ) {
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
			ktadvancedheadingUniqueIDs.push( '_' + this.props.clientId.substr( 2, 9 ) );
		} else {
			ktadvancedheadingUniqueIDs.push( this.props.attributes.uniqueID );
		}
		const blockSettings = ( kadence_blocks_params.settings ? JSON.parse( kadence_blocks_params.settings ) : {} );
		if ( blockSettings[ 'kadence/advancedheading' ] !== undefined && typeof blockSettings[ 'kadence/advancedheading' ] === 'object' ) {
			this.setState( { settings: blockSettings[ 'kadence/advancedheading' ] } );
		}
	}
	// componentDidUpdate( prevProps ) {
	// 	if ( prevProps.getPreviewDevice !== this.props.getPreviewDevice ) {
	// 		console.log( 'dosomething' );
	// 	}
	// }
	saveShadow( value ) {
		const { attributes, setAttributes } = this.props;
		const { textShadow } = attributes;

		const newItems = textShadow.map( ( item, thisIndex ) => {
			if ( 0 === thisIndex ) {
				item = { ...item, ...value };
			}

			return item;
		} );
		setAttributes( {
			textShadow: newItems,
		} );
	}
	showSettings( key ) {
		if ( undefined === this.state.settings[ key ] || 'all' === this.state.settings[ key ] ) {
			return true;
		} else if ( 'contributor' === this.state.settings[ key ] && ( 'contributor' === this.state.user || 'author' === this.state.user || 'editor' === this.state.user || 'admin' === this.state.user ) ) {
			return true;
		} else if ( 'author' === this.state.settings[ key ] && ( 'author' === this.state.user || 'editor' === this.state.user || 'admin' === this.state.user ) ) {
			return true;
		} else if ( 'editor' === this.state.settings[ key ] && ( 'editor' === this.state.user || 'admin' === this.state.user ) ) {
			return true;
		} else if ( 'admin' === this.state.settings[ key ] && 'admin' === this.state.user ) {
			return true;
		}
		return false;
	}
	getPreviewSize( device, desktopSize, tabletSize, mobileSize ) {
		if ( device === 'Mobile' ) {
			if ( undefined !== mobileSize && '' !== mobileSize ) {
				return mobileSize;
			} else if ( undefined !== tabletSize && '' !== tabletSize ) {
				return tabletSize;
			}
		} else if ( device === 'Tablet' ) {
			if ( undefined !== tabletSize && '' !== tabletSize ) {
				return tabletSize;
			}
		}
		return desktopSize;
	}
	render() {
		const { attributes, className, setAttributes, mergeBlocks, onReplace } = this.props;
		const { uniqueID, align, level, content, color, colorClass, textShadow, mobileAlign, tabletAlign, size, sizeType, lineType, lineHeight, tabLineHeight, tabSize, mobileSize, mobileLineHeight, letterSpacing, typography, fontVariant, fontWeight, fontStyle, fontSubset, googleFont, loadGoogleFont, marginType, topMargin, bottomMargin, markSize, markSizeType, markLineHeight, markLineType, markLetterSpacing, markTypography, markGoogleFont, markLoadGoogleFont, markFontSubset, markFontVariant, markFontWeight, markFontStyle, markPadding, markPaddingControl, markColor, markBG, markBGOpacity, markBorder, markBorderWidth, markBorderOpacity, markBorderStyle, anchor, textTransform, markTextTransform, kadenceAnimation, kadenceAOSOptions, htmlTag, leftMargin, rightMargin, tabletMargin, mobileMargin, padding, tabletPadding, mobilePadding, paddingType, markMobilePadding, markTabPadding } = attributes;
		const markBGString = ( markBG ? KadenceColorOutput( markBG, markBGOpacity ) : '' );
		const markBorderString = ( markBorder ? KadenceColorOutput( markBorder, markBorderOpacity ) : '' );
		const gconfig = {
			google: {
				families: [ typography + ( fontVariant ? ':' + fontVariant : '' ) ],
			},
		};
		const sgconfig = {
			google: {
				families: [ markTypography + ( markFontVariant ? ':' + markFontVariant : '' ) ],
			},
		};
		const config = ( googleFont ? gconfig : '' );
		const sconfig = ( markGoogleFont ? sgconfig : '' );
		const tagName = htmlTag && htmlTag !== 'heading' ? htmlTag : 'h' + level;
		const fontMin = ( sizeType !== 'px' ? 0.2 : 5 );
		const marginMin = ( marginType === 'em' || marginType === 'rem' ? -2 : -200 );
		const marginMax = ( marginType === 'em' || marginType === 'rem' ? 12 : 200 );
		const marginStep = ( marginType === 'em' || marginType === 'rem' ? 0.1 : 1 );
		const paddingMin = ( paddingType === 'em' || paddingType === 'rem' ? 0 : 0 );
		const paddingMax = ( paddingType === 'em' || paddingType === 'rem' ? 12 : 200 );
		const paddingStep = ( paddingType === 'em' || paddingType === 'rem' ? 0.1 : 1 );
		const fontMax = ( sizeType !== 'px' ? 12 : 200 );
		const fontStep = ( sizeType !== 'px' ? 0.1 : 1 );
		const lineMin = ( lineType !== 'px' ? 0.2 : 5 );
		const lineMax = ( lineType !== 'px' ? 12 : 200 );
		const lineStep = ( lineType !== 'px' ? 0.1 : 1 );
		const previewMarginTop = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== topMargin ? topMargin : '' ), ( undefined !== tabletMargin ? tabletMargin[ 0 ] : '' ), ( undefined !== mobileMargin ? mobileMargin[ 0 ] : '' ) );
		const previewMarginRight = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== rightMargin ? rightMargin : '' ), ( undefined !== tabletMargin ? tabletMargin[ 1 ] : '' ), ( undefined !== mobileMargin ? mobileMargin[ 1 ] : '' ) );
		const previewMarginBottom = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== bottomMargin ? bottomMargin : '' ), ( undefined !== tabletMargin ? tabletMargin[ 2 ] : '' ), ( undefined !== mobileMargin ? mobileMargin[ 2 ] : '' ) );
		const previewMarginLeft = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== leftMargin ? leftMargin : '' ), ( undefined !== tabletMargin ? tabletMargin[ 3 ] : '' ), ( undefined !== mobileMargin ? mobileMargin[ 3 ] : '' ) );
		const previewPaddingTop = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== padding ? padding[ 0 ] : '' ), ( undefined !== tabletPadding ? tabletPadding[ 0 ] : '' ), ( undefined !== mobilePadding ? mobilePadding[ 0 ] : '' ) );
		const previewPaddingRight = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== padding ? padding[ 1 ] : '' ), ( undefined !== tabletPadding ? tabletPadding[ 1 ] : '' ), ( undefined !== mobilePadding ? mobilePadding[ 1 ] : '' ) );
		const previewPaddingBottom = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== padding ? padding[ 2 ] : '' ), ( undefined !== tabletPadding ? tabletPadding[ 2 ] : '' ), ( undefined !== mobilePadding ? mobilePadding[ 2 ] : '' ) );
		const previewPaddingLeft = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== padding ? padding[ 3 ] : '' ), ( undefined !== tabletPadding ? tabletPadding[ 3 ] : '' ), ( undefined !== mobilePadding ? mobilePadding[ 3 ] : '' ) );
		const previewFontSize = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== size ? size : '' ), ( undefined !== tabSize ? tabSize : '' ), ( undefined !== mobileSize ? mobileSize : '' ) );
		const previewLineHeight = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== lineHeight ? lineHeight : '' ), ( undefined !== tabLineHeight ? tabLineHeight : '' ), ( undefined !== mobileLineHeight ? mobileLineHeight : '' ) );
		const previewAlign = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== align ? align : '' ), ( undefined !== tabletAlign ? tabletAlign : '' ), ( undefined !== mobileAlign ? mobileAlign : '' ) );
		const previewMarkPaddingTop = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== markPadding ? markPadding[ 0 ] : 0 ), ( undefined !== markTabPadding ? markTabPadding[ 0 ] : '' ), ( undefined !== markMobilePadding ? markMobilePadding[ 0 ] : '' ) );
		const previewMarkPaddingRight = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== markPadding ? markPadding[ 1 ] : 0 ), ( undefined !== markTabPadding ? markTabPadding[ 1 ] : '' ), ( undefined !== markMobilePadding ? markMobilePadding[ 1 ] : '' ) );
		const previewMarkPaddingBottom = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== markPadding ? markPadding[ 2 ] : 0 ), ( undefined !== markTabPadding ? markTabPadding[ 2 ] : '' ), ( undefined !== markMobilePadding ? markMobilePadding[ 2 ] : '' ) );
		const previewMarkPaddingLeft = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== markPadding ? markPadding[ 3 ] : 0 ), ( undefined !== markTabPadding ? markTabPadding[ 3 ] : '' ), ( undefined !== markMobilePadding ? markMobilePadding[ 3 ] : '' ) );
		const previewMarkSize = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== markSize ? markSize[ 0 ] : '' ), ( undefined !== markSize ? markSize[ 1 ] : '' ), ( undefined !== markSize ? markSize[ 2 ] : '' ) );
		const previewMarkLineHeight = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== markLineHeight ? markLineHeight[ 0 ] : '' ), ( undefined !== markLineHeight ? markLineHeight[ 1 ] : '' ), ( undefined !== markLineHeight ? markLineHeight[ 2 ] : '' ) );
		const headingOptions = [
			[
				{
					icon: <HeadingLevelIcon level={ 1 } isPressed={ ( 1 === level && htmlTag && htmlTag === 'heading' ? true : false ) } />,
					title: __( 'Heading 1', 'kadence-blocks' ),
					isActive: ( 1 === level && htmlTag && htmlTag === 'heading' ? true : false ),
					onClick: () => setAttributes( { level: 1, htmlTag: 'heading' } ),
				},
			],
			[
				{
					icon: <HeadingLevelIcon level={ 2 } isPressed={ ( 2 === level && htmlTag && htmlTag === 'heading' ? true : false ) } />,
					title: __( 'Heading 2', 'kadence-blocks' ),
					isActive: ( 2 === level && htmlTag && htmlTag === 'heading' ? true : false ),
					onClick: () => setAttributes( { level: 2, htmlTag: 'heading' } ),
				},
			],
			[
				{
					icon: <HeadingLevelIcon level={ 3 } isPressed={ ( 3 === level && htmlTag && htmlTag === 'heading' ? true : false ) } />,
					title: __( 'Heading 3', 'kadence-blocks' ),
					isActive: ( 3 === level && htmlTag && htmlTag === 'heading' ? true : false ),
					onClick: () => setAttributes( { level: 3, htmlTag: 'heading' } ),
				},
			],
			[
				{
					icon: <HeadingLevelIcon level={ 4 } isPressed={ ( 4 === level && htmlTag && htmlTag === 'heading' ? true : false ) } />,
					title: __( 'Heading 4', 'kadence-blocks' ),
					isActive: ( 4 === level && htmlTag && htmlTag === 'heading' ? true : false ),
					onClick: () => setAttributes( { level: 4, htmlTag: 'heading' } ),
				},
			],
			[
				{
					icon: <HeadingLevelIcon level={ 5 } isPressed={ ( 5 === level && htmlTag && htmlTag === 'heading' ? true : false ) } />,
					title: __( 'Heading 5', 'kadence-blocks' ),
					isActive: ( 5 === level && htmlTag && htmlTag === 'heading' ? true : false ),
					onClick: () => setAttributes( { level: 5, htmlTag: 'heading' } ),
				},
			],
			[
				{
					icon: <HeadingLevelIcon level={ 6 } isPressed={ ( 6 === level && htmlTag && htmlTag === 'heading' ? true : false ) } />,
					title: __( 'Heading 6', 'kadence-blocks' ),
					isActive: ( 6 === level && htmlTag && htmlTag === 'heading' ? true : false ),
					onClick: () => setAttributes( { level: 6, htmlTag: 'heading' } ),
				},
			],
			[
				{
					icon: <HeadingLevelIcon level={ 'p' } isPressed={ ( htmlTag && htmlTag === 'p' ? true : false ) } />,
					title: __( 'Paragraph', 'kadence-blocks' ),
					isActive: ( htmlTag && htmlTag === 'p' ? true : false ),
					onClick: () => setAttributes( { htmlTag: 'p' } ),
				},
			],
		];
		const classes = classnames( {
			[ `kt-adv-heading${ uniqueID }` ]: uniqueID,
			[ className ]: className,
		} );
		const headingContent = (
			<RichText
				tagName={ tagName }
				value={ content }
				onChange={ ( value ) => setAttributes( { content: value } ) }
				onMerge={ mergeBlocks }
				onSplit={ ( value ) => {
					if ( ! value ) {
						return createBlock( 'core/paragraph' );
					}
					return createBlock( 'kadence/advancedheading', {
						...attributes,
						content: value,
					} );
				} }
				onReplace={ onReplace }
				onRemove={ () => onReplace( [] ) }
				style={ {
					textAlign: previewAlign,
					color: color ? KadenceColorOutput( color ) : undefined,
					fontWeight: fontWeight,
					fontStyle: fontStyle,
					fontSize: ( previewFontSize ? previewFontSize + sizeType : undefined ),
					lineHeight: ( previewLineHeight ? previewLineHeight + lineType : undefined ),
					letterSpacing: ( letterSpacing ? letterSpacing + 'px' : undefined ),
					textTransform: ( textTransform ? textTransform : undefined ),
					fontFamily: ( typography ? typography : '' ),
					paddingTop: ( undefined !== previewPaddingTop ? previewPaddingTop + paddingType : undefined ),
					paddingRight: ( undefined !== previewPaddingRight ? previewPaddingRight + paddingType : undefined ),
					paddingBottom: ( undefined !== previewPaddingBottom ? previewPaddingBottom + paddingType : undefined ),
					paddingLeft: ( undefined !== previewPaddingLeft ? previewPaddingLeft + paddingType : undefined ),
					marginTop: ( undefined !== previewMarginTop ? previewMarginTop + marginType : undefined ),
					marginRight: ( undefined !== previewMarginRight ? previewMarginRight + marginType : undefined ),
					marginBottom: ( undefined !== previewMarginBottom ? previewMarginBottom + marginType : undefined ),
					marginLeft: ( undefined !== previewMarginLeft ? previewMarginLeft + marginType : undefined ),
					textShadow: ( undefined !== textShadow && undefined !== textShadow[ 0 ] && undefined !== textShadow[ 0 ].enable && textShadow[ 0 ].enable ? ( undefined !== textShadow[ 0 ].hOffset ? textShadow[ 0 ].hOffset : 1 ) + 'px ' + ( undefined !== textShadow[ 0 ].vOffset ? textShadow[ 0 ].vOffset : 1 ) + 'px ' + ( undefined !== textShadow[ 0 ].blur ? textShadow[ 0 ].blur : 1 ) + 'px ' + ( undefined !== textShadow[ 0 ].color ? KadenceColorOutput( textShadow[ 0 ].color ) : 'rgba(0,0,0,0.2)' ) : undefined ),
				} }
				className={ classes }
				placeholder={ __( 'Write heading…', 'kadence-blocks' ) }
			/>
		);
		return (
			<Fragment>
				<style>
					{ `.kt-adv-heading${ uniqueID } mark, .kt-adv-heading${ uniqueID }.rich-text:focus mark[data-rich-text-format-boundary] {
						color: ${ KadenceColorOutput( markColor ) };
						background: ${ ( markBG ? markBGString : 'transparent' ) };
						font-weight: ${ ( markTypography && markFontWeight ? markFontWeight : 'inherit' ) };
						font-style: ${ ( markTypography && markFontStyle ? markFontStyle : 'inherit' ) };
						font-size: ${ ( previewMarkSize ? previewMarkSize + markSizeType : 'inherit' ) };
						line-height: ${ ( previewMarkLineHeight ? previewMarkLineHeight + markLineType : 'inherit' ) };
						letter-spacing: ${ ( markLetterSpacing ? markLetterSpacing + 'px' : 'inherit' ) };
						text-transform: ${ ( markTextTransform ? markTextTransform : 'inherit' ) };
						font-family: ${ ( markTypography ? markTypography : 'inherit' ) };
						border-color: ${ ( markBorder ? markBorderString : 'transparent' ) };
						border-width: ${ ( markBorderWidth ? markBorderWidth + 'px' : '0' ) };
						border-style: ${ ( markBorderStyle ? markBorderStyle : 'solid' ) };
						padding-top: ${ ( previewMarkPaddingTop ? previewMarkPaddingTop + 'px ' : '0' ) };
						padding-right: ${ ( previewMarkPaddingRight ? previewMarkPaddingRight + 'px ' : '0' ) };
						padding-bottom: ${ ( previewMarkPaddingBottom ? previewMarkPaddingBottom + 'px ' : '0' ) };
						padding-left: ${ ( previewMarkPaddingLeft ? previewMarkPaddingLeft + 'px ' : '0' ) };
					}` }
				</style>
				<BlockControls>
					<ToolbarGroup
						isCollapsed={ true }
						icon={ <HeadingLevelIcon level={ ( htmlTag === 'p' ? 'p' : level ) } /> }
						label={ __( 'Change Heading Level', 'kadence-blocks' ) }
						controls={ headingOptions }
					/>
					{ this.showSettings( 'allSettings' ) && this.showSettings( 'toolbarTypography' ) && (
						<InlineTypographyControls
							uniqueID={ uniqueID }
							fontGroup={ 'heading' }
							letterSpacing={ letterSpacing }
							onLetterSpacing={ ( value ) => setAttributes( { letterSpacing: value } ) }
							fontFamily={ typography }
							onFontFamily={ ( value ) => setAttributes( { typography: value } ) }
							onFontChange={ ( select ) => {
								setAttributes( {
									typography: select.value,
									googleFont: select.google,
								} );
							} }
							googleFont={ googleFont }
							onGoogleFont={ ( value ) => setAttributes( { googleFont: value } ) }
							loadGoogleFont={ loadGoogleFont }
							onLoadGoogleFont={ ( value ) => setAttributes( { loadGoogleFont: value } ) }
							fontVariant={ fontVariant }
							onFontVariant={ ( value ) => setAttributes( { fontVariant: value } ) }
							fontWeight={ fontWeight }
							onFontWeight={ ( value ) => setAttributes( { fontWeight: value } ) }
							fontStyle={ fontStyle }
							onFontStyle={ ( value ) => setAttributes( { fontStyle: value } ) }
							fontSubset={ fontSubset }
							onFontSubset={ ( value ) => setAttributes( { fontSubset: value } ) }
							textTransform={ textTransform }
							onTextTransform={ ( value ) => setAttributes( { textTransform: value } ) }
							fontSizeArray={ false }
							fontSize={ size }
							onFontSize={ ( value ) => setAttributes( { size: value } ) }
							fontSizeType={ sizeType }
							onFontSizeType={ ( value ) => setAttributes( { sizeType: value } ) }
							lineHeight={ lineHeight }
							onLineHeight={ ( value ) => setAttributes( { lineHeight: value } ) }
							lineHeightType={ lineType }
							onLineHeightType={ ( value ) => setAttributes( { lineType: value } ) }
							tabSize={ tabSize }
							onTabSize={ ( value ) => setAttributes( { tabSize: value } ) }
							tabLineHeight={ tabLineHeight }
							onTabLineHeight={ ( value ) => setAttributes( { tabLineHeight: value } ) }
							mobileSize={ mobileSize }
							onMobileSize={ ( value ) => setAttributes( { mobileSize: value } ) }
							mobileLineHeight={ mobileLineHeight }
							onMobileLineHeight={ ( value ) => setAttributes( { mobileLineHeight: value } ) }
						/>
					) }
					<InlineAdvancedPopColorControl
						label={ __( 'Heading Color', 'kadence-blocks' ) }
						colorValue={ ( color ? color : '' ) }
						colorDefault={ '' }
						onColorChange={ value => setAttributes( { color: value } ) }
						onColorClassChange={ value => setAttributes( { colorClass: value } ) }
					/>
					<AlignmentToolbar
						value={ align }
						onChange={ ( nextAlign ) => {
							setAttributes( { align: nextAlign } );
						} }
					/>
					<HeadingStyleCopyPaste
						onPaste={ value => setAttributes( value ) }
						blockAttributes={ this.props.attributes }
					/>
				</BlockControls>
				{ this.showSettings( 'allSettings' ) && (
					<InspectorControls>
						<PanelBody title={ __( 'Heading Settings', 'kadence-blocks' ) }>
							<div className="kb-tag-level-control components-base-control">
								<p className="kb-component-label">{ __( 'HTML Tag', 'kadence-blocks' ) }</p>
								<ToolbarGroup
									isCollapsed={ false }
									label={ __( 'Change Heading Level', 'kadence-blocks' ) }
									controls={ headingOptions }
								/>
							</div>
							<ResponsiveAlignControls
								label={ __( 'Text Alignment', 'kadence-blocks' ) }
								value={ ( align ? align : '' ) }
								mobileValue={ ( mobileAlign ? mobileAlign : '' ) }
								tabletValue={ ( tabletAlign ? tabletAlign : '' ) }
								onChange={ ( nextAlign ) => setAttributes( { align: nextAlign } ) }
								onChangeTablet={ ( nextAlign ) => setAttributes( { tabletAlign: nextAlign } ) }
								onChangeMobile={ ( nextAlign ) => setAttributes( { mobileAlign: nextAlign } ) }
							/>
							{ this.showSettings( 'colorSettings' ) && (
								<AdvancedPopColorControl
									label={ __( 'Heading Color', 'kadence-blocks' ) }
									colorValue={ ( color ? color : '' ) }
									colorDefault={ '' }
									onColorChange={ value => setAttributes( { color: value } ) }
									onColorClassChange={ value => setAttributes( { colorClass: value } ) }
								/>
							) }
							{ this.showSettings( 'sizeSettings' ) && (
								<Fragment>
									<ResponsiveRangeControls
										label={ __( 'Font Size', 'kadence-blocks' ) }
										value={ ( size ? size : '' ) }
										onChange={ value => setAttributes( { size: value } ) }
										tabletValue={ ( tabSize ? tabSize : '' ) }
										onChangeTablet={ ( value ) => setAttributes( { tabSize: value } ) }
										mobileValue={ ( mobileSize ? mobileSize : '' ) }
										onChangeMobile={ ( value ) => setAttributes( { mobileSize: value } ) }
										min={ fontMin }
										max={ fontMax }
										step={ fontStep }
										unit={ sizeType }
										onUnit={ ( value ) => setAttributes( { sizeType: value } ) }
										units={ [ 'px', 'em', 'rem' ] }
									/>
									<ResponsiveRangeControls
										label={ __( 'Line Height', 'kadence-blocks' ) }
										value={ ( lineHeight ? lineHeight : '' ) }
										onChange={ value => setAttributes( { lineHeight: value } ) }
										tabletValue={ ( tabLineHeight ? tabLineHeight : '' ) }
										onChangeTablet={ ( value ) => setAttributes( { tabLineHeight: value } ) }
										mobileValue={ ( mobileLineHeight ? mobileLineHeight : '' ) }
										onChangeMobile={ ( value ) => setAttributes( { mobileLineHeight: value } ) }
										min={ lineMin }
										max={ lineMax }
										step={ lineStep }
										unit={ lineType }
										onUnit={ ( value ) => setAttributes( { lineType: value } ) }
										units={ [ 'px', 'em', 'rem' ] }
									/>
								</Fragment>
							) }
						</PanelBody>
						{ this.showSettings( 'advancedSettings' ) && (
							<PanelBody
								title={ __( 'Advanced Typography Settings', 'kadence-blocks' ) }
								initialOpen={ false }
							>
								<TypographyControls
									fontGroup={ 'heading' }
									letterSpacing={ letterSpacing }
									onLetterSpacing={ ( value ) => setAttributes( { letterSpacing: value } ) }
									fontFamily={ typography }
									onFontFamily={ ( value ) => setAttributes( { typography: value } ) }
									onFontChange={ ( select ) => {
										setAttributes( {
											typography: select.value,
											googleFont: select.google,
										} );
									} }
									googleFont={ googleFont }
									onGoogleFont={ ( value ) => setAttributes( { googleFont: value } ) }
									loadGoogleFont={ loadGoogleFont }
									onLoadGoogleFont={ ( value ) => setAttributes( { loadGoogleFont: value } ) }
									fontVariant={ fontVariant }
									onFontVariant={ ( value ) => setAttributes( { fontVariant: value } ) }
									fontWeight={ fontWeight }
									onFontWeight={ ( value ) => setAttributes( { fontWeight: value } ) }
									fontStyle={ fontStyle }
									onFontStyle={ ( value ) => setAttributes( { fontStyle: value } ) }
									fontSubset={ fontSubset }
									onFontSubset={ ( value ) => setAttributes( { fontSubset: value } ) }
									textTransform={ textTransform }
									onTextTransform={ ( value ) => setAttributes( { textTransform: value } ) }
								/>
							</PanelBody>
						) }
						{ this.showSettings( 'highlightSettings', 'kadence-blocks' ) && (
							<PanelBody
								title={ __( 'Highlight Settings', 'kadence-blocks' ) }
								initialOpen={ false }
							>
								<AdvancedPopColorControl
									label={ __( 'Highlight Color', 'kadence-blocks' ) }
									colorValue={ ( markColor ? markColor : '' ) }
									colorDefault={ '' }
									onColorChange={ value => setAttributes( { markColor: value } ) }
								/>
								<AdvancedPopColorControl
									label={ __( 'Highlight Background', 'kadence-blocks' ) }
									colorValue={ ( markBG ? markBG : '' ) }
									colorDefault={ '' }
									onColorChange={ value => setAttributes( { markBG: value } ) }
									opacityValue={ markBGOpacity }
									onOpacityChange={ value => setAttributes( { markBGOpacity: value } ) }
								/>
								<AdvancedPopColorControl
									label={ __( 'Highlight Border Color', 'kadence-blocks' ) }
									colorValue={ ( markBorder ? markBorder : '' ) }
									colorDefault={ '' }
									onColorChange={ value => setAttributes( { markBorder: value } ) }
									opacityValue={ markBorderOpacity }
									onOpacityChange={ value => setAttributes( { markBorderOpacity: value } ) }
								/>
								<SelectControl
									label={ __( 'Highlight Border Style', 'kadence-blocks' ) }
									value={ markBorderStyle }
									options={ [
										{ value: 'solid', label: __( 'Solid' ) },
										{ value: 'dashed', label: __( 'Dashed' ) },
										{ value: 'dotted', label: __( 'Dotted' ) },
									] }
									onChange={ value => setAttributes( { markBorderStyle: value } ) }
								/>
								<KadenceRange
									label={ __( 'Highlight Border Width', 'kadence-blocks' ) }
									value={ markBorderWidth }
									onChange={ value => setAttributes( { markBorderWidth: value } ) }
									min={ 0 }
									max={ 20 }
									step={ 1 }
								/>
								<ResponsiveRangeControls
									label={ __( 'Font Size', 'kadence-blocks' ) }
									value={ ( markSize && markSize[ 0 ] ? markSize[ 0 ] : '' ) }
									onChange={ ( value ) => setAttributes( { markSize: [ value, ( markSize && markSize[ 1 ] ? markSize[ 1 ] : '' ), ( markSize && markSize[ 2 ] ? markSize[ 2 ] : '' ) ] } ) }
									tabletValue={ ( markSize && markSize[ 1 ] ? markSize[ 1 ] : '' ) }
									onChangeTablet={ ( value ) => setAttributes( { markSize: [ ( markSize && markSize[ 0 ] ? markSize[ 0 ] : '' ), value, ( markSize && markSize[ 2 ] ? markSize[ 2 ] : '' ) ] } ) }
									mobileValue={ ( markSize && markSize[ 2 ] ? markSize[ 2 ] : '' ) }
									onChangeMobile={ ( value ) => setAttributes( { markSize: [ ( markSize && markSize[ 0 ] ? markSize[ 0 ] : '' ), ( markSize && markSize[ 1 ] ? markSize[ 1 ] : '' ), value ] } ) }
									min={ fontMin }
									max={ fontMax }
									step={ fontStep }
									unit={ markSizeType }
									onUnit={ ( value ) => setAttributes( { markSizeType: value } ) }
									units={ [ 'px', 'em', 'rem' ] }
								/>
								<ResponsiveRangeControls
									label={ __( 'Line Height', 'kadence-blocks' ) }
									value={ ( markLineHeight && markLineHeight[ 0 ] ? markLineHeight[ 0 ] : '' ) }
									onChange={ ( value ) => setAttributes( { markLineHeight: [ value, ( markLineHeight && markLineHeight[ 1 ] ? markLineHeight[ 1 ] : '' ), ( markLineHeight && markLineHeight[ 2 ] ? markLineHeight[ 2 ] : '' ) ] } ) }
									tabletValue={ ( markLineHeight && markLineHeight[ 1 ] ? markLineHeight[ 1 ] : '' ) }
									onChangeTablet={ ( value ) => setAttributes( { markLineHeight: [ ( markLineHeight && markLineHeight[ 0 ] ? markLineHeight[ 0 ] : '' ), value, ( markLineHeight && markLineHeight[ 2 ] ? markLineHeight[ 2 ] : '' ) ] } ) }
									mobileValue={ ( markLineHeight && markLineHeight[ 2 ] ? markLineHeight[ 2 ] : '' ) }
									onChangeMobile={ ( value ) => setAttributes( { markLineHeight: [ ( markLineHeight && markLineHeight[ 0 ] ? markLineHeight[ 0 ] : '' ), ( markLineHeight && markLineHeight[ 1 ] ? markLineHeight[ 1 ] : '' ), value ] } ) }
									min={ lineMin }
									max={ lineMax }
									step={ lineStep }
									unit={ lineType }
									onUnit={ ( value ) => setAttributes( { lineType: value } ) }
									units={ [ 'px', 'em', 'rem' ] }
								/>
								<TypographyControls
									fontGroup={ 'heading' }
									fontSize={ markSize }
									onFontSize={ ( value ) => setAttributes( { markSize: value } ) }
									fontSizeType={ markSizeType }
									onFontSizeType={ ( value ) => setAttributes( { markSizeType: value } ) }
									lineHeight={ markLineHeight }
									onLineHeight={ ( value ) => setAttributes( { markLineHeight: value } ) }
									lineHeightType={ markLineType }
									onLineHeightType={ ( value ) => setAttributes( { markLineType: value } ) }
									letterSpacing={ markLetterSpacing }
									onLetterSpacing={ ( value ) => setAttributes( { markLetterSpacing: value } ) }
									fontFamily={ markTypography }
									onFontFamily={ ( value ) => setAttributes( { markTypography: value } ) }
									onFontChange={ ( select ) => {
										setAttributes( {
											markTypography: select.value,
											markGoogleFont: select.google,
										} );
									} }
									googleFont={ markGoogleFont }
									onGoogleFont={ ( value ) => setAttributes( { markGoogleFont: value } ) }
									loadGoogleFont={ markLoadGoogleFont }
									onLoadGoogleFont={ ( value ) => setAttributes( { markLoadGoogleFont: value } ) }
									fontVariant={ markFontVariant }
									onFontVariant={ ( value ) => setAttributes( { markFontVariant: value } ) }
									fontWeight={ markFontWeight }
									onFontWeight={ ( value ) => setAttributes( { markFontWeight: value } ) }
									fontStyle={ markFontStyle }
									onFontStyle={ ( value ) => setAttributes( { markFontStyle: value } ) }
									fontSubset={ markFontSubset }
									onFontSubset={ ( value ) => setAttributes( { markFontSubset: value } ) }
									textTransform={ markTextTransform }
									onTextTransform={ ( value ) => setAttributes( { markTextTransform: value } ) }
								/>
								<ResponsiveMeasuremenuControls
									label={ __( 'Padding', 'kadence-blocks' ) }
									value={ markPadding }
									control={ this.state.markPaddingControls }
									tabletValue={ markTabPadding }
									mobileValue={ markMobilePadding }
									onChange={ ( value ) => setAttributes( { markPadding: value } ) }
									onChangeTablet={ ( value ) => setAttributes( { markTabPadding: value } ) }
									onChangeMobile={ ( value ) => setAttributes( { markMobilePadding: value } ) }
									onChangeControl={ ( value ) => this.setState( { markPaddingControls: value } ) }
									min={ 0 }
									max={ 100 }
									step={ 1 }
									unit={ 'px' }
									units={ [ 'px' ] }
									showUnit={ true }
								/>
							</PanelBody>
						) }
						{ this.showSettings( 'marginSettings' ) && (
							<PanelBody
								title={ __( 'Spacing Settings', 'kadence-blocks' ) }
								initialOpen={ false }
							>
								<ResponsiveMeasuremenuControls
									label={ __( 'Padding', 'kadence-blocks' ) }
									value={ padding }
									control={ this.state.paddingControl }
									tabletValue={ tabletPadding }
									mobileValue={ mobilePadding }
									onChange={ ( value ) => setAttributes( { padding: value } ) }
									onChangeTablet={ ( value ) => setAttributes( { tabletPadding: value } ) }
									onChangeMobile={ ( value ) => setAttributes( { mobilePadding: value } ) }
									onChangeControl={ ( value ) => this.setState( { paddingControl: value } ) }
									min={ paddingMin }
									max={ paddingMax }
									step={ paddingStep }
									unit={ paddingType }
									units={ [ 'px', 'em', 'rem', '%' ] }
									onUnit={ ( value ) => setAttributes( { paddingType: value } ) }
								/>
								<ResponsiveMeasuremenuControls
									label={ __( 'Margin', 'kadence-blocks' ) }
									value={ [ ( undefined !== topMargin ? topMargin : '' ), ( undefined !== rightMargin ? rightMargin : '' ), ( undefined !== bottomMargin ? bottomMargin : '' ), ( undefined !== leftMargin ? leftMargin : '' ) ] }
									control={ this.state.marginControl }
									tabletValue={ tabletMargin }
									mobileValue={ mobileMargin }
									onChange={ ( value ) => {
										setAttributes( { topMargin: value[ 0 ], rightMargin: value[ 1 ], bottomMargin: value[ 2 ], leftMargin: value[ 3 ] } );
									} }
									onChangeTablet={ ( value ) => setAttributes( { tabletMargin: value } ) }
									onChangeMobile={ ( value ) => setAttributes( { mobileMargin: value } ) }
									onChangeControl={ ( value ) => this.setState( { marginControl: value } ) }
									min={ marginMin }
									max={ marginMax }
									step={ marginStep }
									unit={ marginType }
									units={ [ 'px', 'em', 'rem', '%', 'vh' ] }
									onUnit={ ( value ) => setAttributes( { marginType: value } ) }
								/>
							</PanelBody>
						) }
						<PanelBody
							title={ __( 'Text Shadow Settings' ) }
							initialOpen={ false }
						>
							<TextShadowControl
								label={ __( 'Text Shadow', 'kadence-blocks' ) }
								enable={ ( undefined !== textShadow && undefined !== textShadow[ 0 ] && undefined !== textShadow[ 0 ].enable ? textShadow[ 0 ].enable : false ) }
								color={ ( undefined !== textShadow && undefined !== textShadow[ 0 ] && undefined !== textShadow[ 0 ].color ? textShadow[ 0 ].color : 'rgba(0, 0, 0, 0.2)' ) }
								colorDefault={ 'rgba(0, 0, 0, 0.2)' }
								hOffset={ ( undefined !== textShadow && undefined !== textShadow[ 0 ] && undefined !== textShadow[ 0 ].hOffset ? textShadow[ 0 ].hOffset : 1 ) }
								vOffset={ ( undefined !== textShadow && undefined !== textShadow[ 0 ] && undefined !== textShadow[ 0 ].vOffset ? textShadow[ 0 ].vOffset : 1 ) }
								blur={ ( undefined !== textShadow && undefined !== textShadow[ 0 ] && undefined !== textShadow[ 0 ].blur ? textShadow[ 0 ].blur : 1 ) }
								onEnableChange={ value => {
									this.saveShadow( { enable: value } );
								} }
								onColorChange={ value => {
									this.saveShadow( { color: value } );
								} }
								onHOffsetChange={ value => {
									this.saveShadow( { hOffset: value } );
								} }
								onVOffsetChange={ value => {
									this.saveShadow( { vOffset: value } );
								} }
								onBlurChange={ value => {
									this.saveShadow( { blur: value } );
								} }
							/>
						</PanelBody>
					</InspectorControls>
				) }
				<InspectorAdvancedControls>
					<TextControl
						label={ __( 'HTML Anchor' ) }
						help={ __( 'Anchors lets you link directly to a section on a page.' ) }
						value={ anchor || '' }
						onChange={ ( nextValue ) => {
							nextValue = nextValue.replace( ANCHOR_REGEX, '-' );
							setAttributes( {
								anchor: nextValue,
							} );
						} } />
				</InspectorAdvancedControls>
				{ kadenceAnimation && (
					<div className={ `kt-animation-wrap-${ kadenceAnimation }` }>
						<div id={ `animate-id${ uniqueID }` } className={ 'aos-animate kt-animation-wrap' } data-aos={ ( kadenceAnimation ? kadenceAnimation : undefined ) }
							data-aos-duration={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].duration ? kadenceAOSOptions[ 0 ].duration : undefined ) }
							data-aos-easing={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].easing ? kadenceAOSOptions[ 0 ].easing : undefined ) }
						>
							{ headingContent }
						</div>
					</div>
				) }
				{ ! kadenceAnimation && (
					headingContent
				) }
				{ googleFont && (
					<WebfontLoader config={ config }>
					</WebfontLoader>
				) }
				{ markGoogleFont && (
					<WebfontLoader config={ sconfig }>
					</WebfontLoader>
				) }
			</Fragment>
		);
	}
}
//export default ( KadenceAdvancedHeading );
export default compose( [
	withSelect( ( select, ownProps ) => {
		const {
			__experimentalGetPreviewDeviceType,
		} = select( 'core/edit-post' );
		return {
			getPreviewDevice: __experimentalGetPreviewDeviceType ? __experimentalGetPreviewDeviceType() : 'Desktop',
		};
	} ),
] )( KadenceAdvancedHeading );