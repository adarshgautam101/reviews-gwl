import { useState, useCallback, useEffect } from 'react';
import { useActionData, useLoaderData, useSubmit, useNavigation } from '@remix-run/react';
import { HSBColor, LoaderData, ActionData } from '../types/settings';
import { hexToHsb, hsbToHex } from '../utils/settings.helpers';

export function useSettingsForm() {
    const loaderData = useLoaderData<LoaderData>();
    const {
        starColor: initialStarColor = '#FFD700',
        backgroundColor: initialBackgroundColor = '#F9F9F9',
        headingColor: initialHeadingColor = '#222222',
        reviewCardColor: initialReviewCardColor = '#FFFFFF',
        reviewsPerSlide: initialReviewsPerSlide = 3,
        displayType: initialDisplayType = 'slider',
        gridRows: initialGridRows = 2,
        gridColumns: initialGridColumns = 2,
        sectionBorderRadius: initialSectionBorderRadius = 12,
        sliderAutoplay: initialSliderAutoplay = true,
        sliderSpeed: initialSliderSpeed = 3000,
        sliderLoop: initialSliderLoop = true,
        sliderDirection: initialSliderDirection = 'horizontal',
        spaceBetween: initialSpaceBetween = 20,
        showNavigation: initialShowNavigation = true,
        sliderEffect: initialSliderEffect = 'slide',

        headingText: initialHeadingText = "CUSTOMER TESTIMONIALS",
        headingFontFamily: initialHeadingFontFamily = "theme",
        headingFontSize: initialHeadingFontSize = 40,
        headingFontWeight: initialHeadingFontWeight = "bold",
        headingFontStyle: initialHeadingFontStyle = "normal",
        headingTextTransform: initialHeadingTextTransform = "uppercase",
        headingLetterSpacing: initialHeadingLetterSpacing = 0,
        headingLineHeight: initialHeadingLineHeight = 1.2,
        headingTextShadow: initialHeadingTextShadow = "none",

        ratingLabelText: initialRatingLabelText = "Excellent",
        ratingLabelFontFamily: initialRatingLabelFontFamily = "theme",
        ratingLabelFontSize: initialRatingLabelFontSize = 18,
        ratingLabelFontWeight: initialRatingLabelFontWeight = "600",
        ratingLabelColor: initialRatingLabelColor = "#555555",

        ratingValueFontFamily: initialRatingValueFontFamily = "theme",
        ratingValueFontSize: initialRatingValueFontSize = 18,
        ratingValueFontWeight: initialRatingValueFontWeight = "600",
        ratingValueColor: initialRatingValueColor = "#555555",

        reviewCountPrefix: initialReviewCountPrefix = "Based on",
        reviewCountSuffix: initialReviewCountSuffix = "reviews",
        reviewCountFontFamily: initialReviewCountFontFamily = "theme",
        reviewCountFontSize: initialReviewCountFontSize = 16,
        reviewCountFontWeight: initialReviewCountFontWeight = "normal",
        reviewCountColor: initialReviewCountColor = "#777777",
    } = loaderData;

    const actionData = useActionData<ActionData>();
    const submit = useSubmit();
    const navigation = useNavigation();

    // State variables
    const [starColor, setStarColor] = useState<HSBColor>(hexToHsb(initialStarColor));
    const [backgroundColor, setBackgroundColor] = useState<HSBColor>(hexToHsb(initialBackgroundColor));
    const [headingColor, setHeadingColor] = useState<HSBColor>(hexToHsb(initialHeadingColor));
    const [reviewCardColor, setReviewCardColor] = useState<HSBColor>(hexToHsb(initialReviewCardColor));
    const [reviewsPerSlide, setReviewsPerSlide] = useState<number>(initialReviewsPerSlide);
    const [displayType, setDisplayType] = useState<string>(initialDisplayType);
    const [gridRows, setGridRows] = useState<number>(initialGridRows);
    const [gridColumns, setGridColumns] = useState<number>(initialGridColumns);
    const [sectionBorderRadius, setSectionBorderRadius] = useState<number>(initialSectionBorderRadius);
    const [sliderAutoplay, setSliderAutoplay] = useState<boolean>(initialSliderAutoplay);
    const [sliderSpeed, setSliderSpeed] = useState<number>(initialSliderSpeed);
    const [sliderLoop, setSliderLoop] = useState<boolean>(initialSliderLoop);
    const [sliderDirection, setSliderDirection] = useState<string>(initialSliderDirection);
    const [spaceBetween, setSpaceBetween] = useState<number>(initialSpaceBetween);
    const [showNavigation, setShowNavigation] = useState<boolean>(initialShowNavigation);
    const [sliderEffect, setSliderEffect] = useState<string>(initialSliderEffect);

    const [headingText, setHeadingText] = useState<string>(initialHeadingText);
    const [headingFontFamily, setHeadingFontFamily] = useState<string>(initialHeadingFontFamily);
    const [headingFontSize, setHeadingFontSize] = useState<number>(initialHeadingFontSize);
    const [headingFontWeight, setHeadingFontWeight] = useState<string>(initialHeadingFontWeight);
    const [headingFontStyle, setHeadingFontStyle] = useState<string>(initialHeadingFontStyle);
    const [headingTextTransform, setHeadingTextTransform] = useState<string>(initialHeadingTextTransform);
    const [headingLetterSpacing, setHeadingLetterSpacing] = useState<number>(initialHeadingLetterSpacing);
    const [headingLineHeight, setHeadingLineHeight] = useState<number>(initialHeadingLineHeight);
    const [headingTextShadow, setHeadingTextShadow] = useState<string>(initialHeadingTextShadow);

    const [ratingLabelText, setRatingLabelText] = useState<string>(initialRatingLabelText);
    const [ratingLabelFontFamily, setRatingLabelFontFamily] = useState<string>(initialRatingLabelFontFamily);
    const [ratingLabelFontSize, setRatingLabelFontSize] = useState<number>(initialRatingLabelFontSize);
    const [ratingLabelFontWeight, setRatingLabelFontWeight] = useState<string>(initialRatingLabelFontWeight);
    const [ratingLabelColor, setRatingLabelColor] = useState<HSBColor>(hexToHsb(initialRatingLabelColor));

    const [ratingValueFontFamily, setRatingValueFontFamily] = useState<string>(initialRatingValueFontFamily);
    const [ratingValueFontSize, setRatingValueFontSize] = useState<number>(initialRatingValueFontSize);
    const [ratingValueFontWeight, setRatingValueFontWeight] = useState<string>(initialRatingValueFontWeight);
    const [ratingValueColor, setRatingValueColor] = useState<HSBColor>(hexToHsb(initialRatingValueColor));

    const [reviewCountPrefix, setReviewCountPrefix] = useState<string>(initialReviewCountPrefix);
    const [reviewCountSuffix, setReviewCountSuffix] = useState<string>(initialReviewCountSuffix);
    const [reviewCountFontFamily, setReviewCountFontFamily] = useState<string>(initialReviewCountFontFamily);
    const [reviewCountFontSize, setReviewCountFontSize] = useState<number>(initialReviewCountFontSize);
    const [reviewCountFontWeight, setReviewCountFontWeight] = useState<string>(initialReviewCountFontWeight);
    const [reviewCountColor, setReviewCountColor] = useState<HSBColor>(hexToHsb(initialReviewCountColor));

    const [activeToast, setActiveToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastError, setToastError] = useState(false);

    useEffect(() => {
        if (actionData) {
            if (actionData.success) {
                setToastMessage(actionData.message || 'Settings saved!');
                setToastError(false);
            } else {
                setToastMessage(actionData.error || 'Failed to save settings.');
                setToastError(true);
            }
            setActiveToast(true);
        }
    }, [actionData]);

    // Handlers
    const handleStarColorChange = useCallback((value: HSBColor) => setStarColor({ ...value }), []);
    const handleBackgroundColorChange = useCallback((value: HSBColor) => setBackgroundColor({ ...value }), []);
    const handleHeadingColorChange = useCallback((value: HSBColor) => setHeadingColor({ ...value }), []);
    const handleReviewCardColorChange = useCallback((value: HSBColor) => setReviewCardColor({ ...value }), []);

    const handleReviewsPerSlideChange = useCallback((value: string) => {
        if (value === '') {
            setReviewsPerSlide(0);
            return;
        }
        const parsedValue = parseInt(value, 10);
        if (!isNaN(parsedValue)) {
            if (parsedValue > 6) setReviewsPerSlide(6);
            else setReviewsPerSlide(parsedValue);
        }
    }, []);

    const handleReviewsPerSlideBlur = useCallback(() => {
        if (reviewsPerSlide === 0) setReviewsPerSlide(3); // Default
        else if (reviewsPerSlide < 1) setReviewsPerSlide(1);
        else if (reviewsPerSlide > 6) setReviewsPerSlide(6);
    }, [reviewsPerSlide]);

    const handleGridRowsChange = useCallback((value: string) => {
        if (value === '') {
            setGridRows(0);
            return;
        }
        const parsedValue = parseInt(value, 10);
        if (!isNaN(parsedValue)) {
            if (parsedValue > 6) setGridRows(6);
            else setGridRows(parsedValue);
        }
    }, []);

    const handleGridRowsBlur = useCallback(() => {
        if (gridRows === 0) setGridRows(2); // Default
        else if (gridRows < 1) setGridRows(1);
        else if (gridRows > 6) setGridRows(6);
    }, [gridRows]);

    const handleGridColumnsChange = useCallback((value: string) => {
        if (value === '') {
            setGridColumns(0);
            return;
        }
        const parsedValue = parseInt(value, 10);
        if (!isNaN(parsedValue)) {
            if (parsedValue > 6) setGridColumns(6);
            else setGridColumns(parsedValue);
        }
    }, []);

    const handleGridColumnsBlur = useCallback(() => {
        if (gridColumns === 0) setGridColumns(2); // Default
        else if (gridColumns < 1) setGridColumns(1);
        else if (gridColumns > 6) setGridColumns(6);
    }, [gridColumns]);

    const handleSectionBorderRadiusChange = useCallback((value: string) => {
        if (value === '') {
            setSectionBorderRadius(0);
            return;
        }
        const parsedValue = parseInt(value, 10);
        if (!isNaN(parsedValue)) {
            if (parsedValue > 50) setSectionBorderRadius(50);
            else setSectionBorderRadius(parsedValue);
        }
    }, []);

    const handleSectionBorderRadiusBlur = useCallback(() => {
        if (sectionBorderRadius < 0) setSectionBorderRadius(0);
        else if (sectionBorderRadius > 50) setSectionBorderRadius(50);
    }, [sectionBorderRadius]);

    const handleSliderSpeedChange = useCallback((value: string) => {
        if (value === '') {
            setSliderSpeed(0);
            return;
        }
        const parsedValue = parseInt(value, 10);
        if (!isNaN(parsedValue)) {
            if (parsedValue > 12000) setSliderSpeed(12000);
            else if (parsedValue < 0) setSliderSpeed(0);
            else setSliderSpeed(parsedValue);
        }
    }, []);

    const handleSliderSpeedBlur = useCallback(() => {
        if (sliderSpeed === 0) setSliderSpeed(3000); // Default
        else if (sliderSpeed < 2000) setSliderSpeed(2000);
        else if (sliderSpeed > 12000) setSliderSpeed(12000);
    }, [sliderSpeed]);

    const handleSpaceBetweenChange = useCallback((value: string) => {
        if (value === '') {
            setSpaceBetween(0);
            return;
        }
        const parsedValue = parseInt(value, 10);
        if (!isNaN(parsedValue)) {
            if (parsedValue > 100) setSpaceBetween(100);
            else if (parsedValue < 0) setSpaceBetween(0);
            else setSpaceBetween(parsedValue);
        }
    }, []);

    const handleSpaceBetweenBlur = useCallback(() => {
        if (spaceBetween < 0) setSpaceBetween(0);
        else if (spaceBetween > 100) setSpaceBetween(100);
    }, [spaceBetween]);

    const handleHeadingFontSizeChange = useCallback((value: string) => {
        if (value === '') {
            setHeadingFontSize(0);
            return;
        }
        const parsedValue = parseInt(value, 10);
        if (!isNaN(parsedValue)) {
            if (parsedValue > 50) setHeadingFontSize(50);
            else setHeadingFontSize(parsedValue);
        }
    }, []);

    const handleHeadingFontSizeBlur = useCallback(() => {
        if (headingFontSize === 0) setHeadingFontSize(40); // Default
        else if (headingFontSize < 1) setHeadingFontSize(1);
        else if (headingFontSize > 50) setHeadingFontSize(50);
    }, [headingFontSize]);

    const handleHeadingLetterSpacingChange = useCallback((value: string) => {
        const parsedValue = parseInt(value, 10);
        if (value === '' || !isNaN(parsedValue)) {
            if (!isNaN(parsedValue) && parsedValue > 50) setHeadingLetterSpacing(50);
            else setHeadingLetterSpacing(value === '' ? 0 : parsedValue);
        }
    }, []);

    const handleHeadingLetterSpacingBlur = useCallback(() => {
        if (headingLetterSpacing < -10) setHeadingLetterSpacing(-10);
        else if (headingLetterSpacing > 50) setHeadingLetterSpacing(50);
    }, [headingLetterSpacing]);

    const handleHeadingLineHeightChange = useCallback((value: string) => {
        const parsedValue = parseFloat(value);
        if (value === '' || !isNaN(parsedValue)) {
            if (!isNaN(parsedValue) && parsedValue > 3) setHeadingLineHeight(3);
            else setHeadingLineHeight(value === '' ? 0 : parsedValue);
        }
    }, []);

    const handleHeadingLineHeightBlur = useCallback(() => {
        if (headingLineHeight === 0) setHeadingLineHeight(1.2); // Default
        else if (headingLineHeight < 0.5) setHeadingLineHeight(0.5);
        else if (headingLineHeight > 3) setHeadingLineHeight(3);
    }, [headingLineHeight]);

    const handleRatingLabelFontSizeChange = useCallback((value: string) => {
        if (value === '') {
            setRatingLabelFontSize(0);
            return;
        }
        const parsedValue = parseInt(value, 10);
        if (!isNaN(parsedValue)) {
            if (parsedValue > 50) setRatingLabelFontSize(50);
            else setRatingLabelFontSize(parsedValue);
        }
    }, []);

    const handleRatingLabelFontSizeBlur = useCallback(() => {
        if (ratingLabelFontSize === 0) setRatingLabelFontSize(18); // Default
        else if (ratingLabelFontSize < 1) setRatingLabelFontSize(1);
        else if (ratingLabelFontSize > 50) setRatingLabelFontSize(50);
    }, [ratingLabelFontSize]);

    const handleRatingValueFontSizeChange = useCallback((value: string) => {
        if (value === '') {
            setRatingValueFontSize(0);
            return;
        }
        const parsedValue = parseInt(value, 10);
        if (!isNaN(parsedValue)) {
            if (parsedValue > 50) setRatingValueFontSize(50);
            else setRatingValueFontSize(parsedValue);
        }
    }, []);

    const handleRatingValueFontSizeBlur = useCallback(() => {
        if (ratingValueFontSize === 0) setRatingValueFontSize(18); // Default
        else if (ratingValueFontSize < 1) setRatingValueFontSize(1);
        else if (ratingValueFontSize > 50) setRatingValueFontSize(50);
    }, [ratingValueFontSize]);

    const handleReviewCountFontSizeChange = useCallback((value: string) => {
        if (value === '') {
            setReviewCountFontSize(0);
            return;
        }
        const parsedValue = parseInt(value, 10);
        if (!isNaN(parsedValue)) {
            if (parsedValue > 50) setReviewCountFontSize(50);
            else setReviewCountFontSize(parsedValue);
        }
    }, []);

    const handleReviewCountFontSizeBlur = useCallback(() => {
        if (reviewCountFontSize === 0) setReviewCountFontSize(16); // Default
        else if (reviewCountFontSize < 1) setReviewCountFontSize(1);
        else if (reviewCountFontSize > 50) setReviewCountFontSize(50);
    }, [reviewCountFontSize]);

    const handleRatingLabelColorChange = useCallback((value: HSBColor) => setRatingLabelColor({ ...value }), []);
    const handleRatingValueColorChange = useCallback((value: HSBColor) => setRatingValueColor({ ...value }), []);
    const handleReviewCountColorChange = useCallback((value: HSBColor) => setReviewCountColor({ ...value }), []);

    const handleSubmit = useCallback(() => {
        const formData = new FormData();
        formData.append('starColor', hsbToHex(starColor));
        formData.append('backgroundColor', hsbToHex(backgroundColor));
        formData.append('headingColor', hsbToHex(headingColor));
        formData.append('reviewCardColor', hsbToHex(reviewCardColor));
        formData.append('reviewsPerSlide', String(reviewsPerSlide));
        formData.append('displayType', displayType);
        formData.append('gridRows', String(gridRows));
        formData.append('gridColumns', String(gridColumns));
        formData.append('sectionBorderRadius', String(sectionBorderRadius));
        formData.append('sliderAutoplay', String(sliderAutoplay));
        formData.append('sliderSpeed', String(sliderSpeed));
        formData.append('sliderLoop', String(sliderLoop));
        formData.append('sliderDirection', sliderDirection);
        formData.append('spaceBetween', String(spaceBetween));
        formData.append('showNavigation', String(showNavigation));
        formData.append('sliderEffect', sliderEffect);

        formData.append('headingText', headingText);
        formData.append('headingFontFamily', headingFontFamily);
        formData.append('headingFontSize', String(headingFontSize));
        formData.append('headingFontWeight', headingFontWeight);
        formData.append('headingFontStyle', headingFontStyle);
        formData.append('headingTextTransform', headingTextTransform);
        formData.append('headingLetterSpacing', String(headingLetterSpacing));
        formData.append('headingLineHeight', String(headingLineHeight));
        formData.append('headingTextShadow', headingTextShadow);

        formData.append('ratingLabelText', ratingLabelText);
        formData.append('ratingLabelFontFamily', ratingLabelFontFamily);
        formData.append('ratingLabelFontSize', String(ratingLabelFontSize));
        formData.append('ratingLabelFontWeight', ratingLabelFontWeight);
        formData.append('ratingLabelColor', hsbToHex(ratingLabelColor));

        formData.append('ratingValueFontFamily', ratingValueFontFamily);
        formData.append('ratingValueFontSize', String(ratingValueFontSize));
        formData.append('ratingValueFontWeight', ratingValueFontWeight);
        formData.append('ratingValueColor', hsbToHex(ratingValueColor));

        formData.append('reviewCountPrefix', reviewCountPrefix);
        formData.append('reviewCountSuffix', reviewCountSuffix);
        formData.append('reviewCountFontFamily', reviewCountFontFamily);
        formData.append('reviewCountFontSize', String(reviewCountFontSize));
        formData.append('reviewCountFontWeight', reviewCountFontWeight);
        formData.append('reviewCountColor', hsbToHex(reviewCountColor));

        submit(formData, { method: 'post' });
    }, [
        starColor, backgroundColor, headingColor, reviewCardColor, reviewsPerSlide, displayType,
        gridRows, gridColumns, sectionBorderRadius, sliderAutoplay, sliderSpeed, sliderLoop,
        sliderDirection, spaceBetween, showNavigation, sliderEffect, headingText, headingFontFamily,
        headingFontSize, headingFontWeight, headingFontStyle, headingTextTransform, headingLetterSpacing,
        headingLineHeight, headingTextShadow, ratingLabelText, ratingLabelFontFamily, ratingLabelFontSize,
        ratingLabelFontWeight, ratingLabelColor, ratingValueFontFamily, ratingValueFontSize,
        ratingValueFontWeight, ratingValueColor, reviewCountPrefix, reviewCountSuffix,
        reviewCountFontFamily, reviewCountFontSize, reviewCountFontWeight, reviewCountColor, submit
    ]);

    const isLoading = navigation.state === 'submitting';

    return {
        starColor, backgroundColor, headingColor, reviewCardColor, reviewsPerSlide, displayType,
        gridRows, gridColumns, sectionBorderRadius, sliderAutoplay, sliderSpeed, sliderLoop,
        sliderDirection, spaceBetween, showNavigation, sliderEffect, headingText, headingFontFamily,
        headingFontSize, headingFontWeight, headingFontStyle, headingTextTransform, headingLetterSpacing,
        headingLineHeight, headingTextShadow, ratingLabelText, ratingLabelFontFamily, ratingLabelFontSize,
        ratingLabelFontWeight, ratingLabelColor, ratingValueFontFamily, ratingValueFontSize,
        ratingValueFontWeight, ratingValueColor, reviewCountPrefix, reviewCountSuffix,
        reviewCountFontFamily, reviewCountFontSize, reviewCountFontWeight, reviewCountColor,
        activeToast, toastMessage, toastError, setActiveToast,
        handleStarColorChange, handleBackgroundColorChange, handleHeadingColorChange, handleReviewCardColorChange,
        handleReviewsPerSlideChange, handleReviewsPerSlideBlur, handleGridRowsChange, handleGridRowsBlur,
        handleGridColumnsChange, handleGridColumnsBlur, handleSectionBorderRadiusChange, handleSectionBorderRadiusBlur,
        handleSliderSpeedChange, handleSliderSpeedBlur, handleSpaceBetweenChange, handleSpaceBetweenBlur,
        handleHeadingFontSizeChange, handleHeadingFontSizeBlur, handleHeadingLetterSpacingChange, handleHeadingLetterSpacingBlur,
        handleHeadingLineHeightChange, handleHeadingLineHeightBlur,
        handleRatingLabelFontSizeChange, handleRatingLabelFontSizeBlur,
        handleRatingValueFontSizeChange, handleRatingValueFontSizeBlur,
        handleReviewCountFontSizeChange, handleReviewCountFontSizeBlur,
        handleRatingLabelColorChange, handleRatingValueColorChange, handleReviewCountColorChange,
        handleSubmit, isLoading,
        setHeadingText, setHeadingFontFamily, setHeadingFontWeight, setHeadingFontStyle,
        setHeadingTextTransform, setHeadingTextShadow, setRatingLabelText, setRatingLabelFontFamily,
        setRatingLabelFontWeight, setRatingValueFontFamily, setRatingValueFontWeight,
        setReviewCountPrefix, setReviewCountSuffix, setReviewCountFontFamily, setReviewCountFontWeight,
        setDisplayType, setSliderEffect, setSliderDirection, setSliderAutoplay, setSliderLoop, setShowNavigation
    };
}
