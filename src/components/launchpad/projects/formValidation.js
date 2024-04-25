import { validateContentRules } from "src/utils/custom.validator";

export  const erc20FormValidation = (obj) => {
    const { projectName, tokenLogo, cardImage, bannerImage, countryRestrictions, networkSymbol, tokenListingDate, description, contractAddress,
      tokenName, tokenSymbol, tokenDecimal, totalNumberOfTokens, initialSupply  } = obj;
    const newErrors = {};
    const numbersOnly = /^\d+$/;
    const specialCharsOnly = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
    const emojiRejex =
      /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff]|[\u2010-\u2017])/;

    if (!projectName || projectName === '') {
      newErrors.projectName = 'Is required';
    } else if (!validateContentRules('', projectName) || projectName?.match(numbersOnly) || projectName?.match(specialCharsOnly)) {
      newErrors.projectName = 'Accepts alphanumeric and special chars.';
    }

    if (!countryRestrictions || countryRestrictions === '' || countryRestrictions?.length == 0) {
      newErrors.countryRestrictions = 'Is required';
    }
    if (!networkSymbol || networkSymbol === '') {
      newErrors.networkSymbol = 'Is required';
    }
    if (!tokenLogo || tokenLogo == '') {
      newErrors.tokenLogo = 'Is required';
    }
    if (!cardImage || cardImage == '') {
      newErrors.cardImage = 'Is required';
    }
    if (!bannerImage || bannerImage == '') {
      newErrors.bannerImage = 'Is required';
    }
    if (!tokenListingDate || tokenListingDate === '') {
      newErrors.tokenListingDate = 'Is required';
    }
    if (!initialSupply || initialSupply === '') {
      newErrors.initialSupply = 'Is required';
    }
    if (!description || description == '') {
      newErrors.description = 'Is required';
    }else if (!validateContentRules('', description)|| description?.match(specialCharsOnly) || description?.match(numbersOnly) ) {
      newErrors.description = 'Accepts alphanumeric and special chars.';
    }
    if (!contractAddress || contractAddress == '') {
      newErrors.tokenContractAddress = 'Is required';
    } else if (!validateContentRules("", contractAddress) || (emojiRejex.test(contractAddress))|| contractAddress?.match(specialCharsOnly) || contractAddress?.match(numbersOnly) ) {
      newErrors.tokenContractAddress = 'Accepts alphanumeric and special chars.';
    }
    if (!tokenName || tokenName == '') {
      newErrors.tokenName = 'Is required';
    } else if (!validateContentRules("", tokenName) || (emojiRejex.test(tokenName))|| tokenName?.match(specialCharsOnly) || tokenName?.match(numbersOnly) ) {
      newErrors.tokenName = 'Accepts alphanumeric and special chars.';
    }
    if (!tokenSymbol || tokenSymbol == '') {
      newErrors.tokenSymbol = 'Is required';
    } else if (!validateContentRules("", tokenSymbol) || (emojiRejex.test(tokenSymbol))|| tokenSymbol?.match(specialCharsOnly) || tokenSymbol?.match(numbersOnly) ) {
      newErrors.tokenSymbol = 'Accepts alphanumeric and special chars.';
    }
    if (!tokenDecimal || tokenDecimal == '') {
      newErrors.tokenDecimal = 'Is required';
    } else if (tokenDecimal && (emojiRejex.test(tokenDecimal))) {
      newErrors.tokenDecimal = 'Accepts alphanumeric and special chars.';
    }
    if (!totalNumberOfTokens || totalNumberOfTokens == '') {
      newErrors.totalNumberOfTokens = 'Is required';
    } else if (totalNumberOfTokens && (emojiRejex.test(totalNumberOfTokens))) {
      newErrors.totalNumberOfTokens = 'Accepts alphanumeric and special chars.';
    }
    return newErrors;
  };

  export  const erc721FormValidation = (obj) => {
    const { projectName, tokenLogo, cardImage, bannerImage, countryRestrictions, networkSymbol, tokenListingDate, description,nftImagesCount  } = obj;
    const newErrors = {};
    const numbersOnly = /^\d+$/;
    const specialCharsOnly = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;

    if (!projectName || projectName === '') {
      newErrors.projectName = 'Is required';
    } else if (!validateContentRules('', projectName) || projectName?.match(numbersOnly) || projectName?.match(specialCharsOnly)) {
      newErrors.projectName = 'Accepts alphanumeric and special chars.';
    }

    if (!countryRestrictions || countryRestrictions === '' || countryRestrictions?.length == 0) {
      newErrors.countryRestrictions = 'Is required';
    }
    if (!networkSymbol || networkSymbol === '') {
      newErrors.networkSymbol = 'Is required';
    }
    if (!tokenLogo || tokenLogo == '') {
      newErrors.tokenLogo = 'Is required';
    }
    if (!cardImage || cardImage == '') {
      newErrors.cardImage = 'Is required';
    }
    if (!bannerImage || bannerImage == '') {
      newErrors.bannerImage = 'Is required';
    }
    if (!tokenListingDate || tokenListingDate === '') {
      newErrors.tokenListingDate = 'Is required';
    }
    if (!description || description == '') {
      newErrors.description = 'Is required';
    }else if (!validateContentRules('', description)|| description?.match(specialCharsOnly) || description?.match(numbersOnly) ) {
      newErrors.description = 'Accepts alphanumeric and special chars.';
    }
    if(!nftImagesCount || nftImagesCount ==''){
      newErrors.nftImagesCount = 'Is required';
    }
    return newErrors;
  };

 
  export const allocationValidation = (obj,tokenType) => {
    const { noofSlots, vestingDays, publicStartDate, publicEndDate, privateStartDate, privateEndDate } = obj ;
    const newErrors = {};
    let errorMsg = ''
    const dateRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;
    const privateEndingTimeInSeconds = parseTime(privateEndDate);
    const privateStartingTimeInSeconds = parseTime(privateStartDate);
    const publicEndingTimeInSeconds = parseTime(publicEndDate);
    const publicStartingTimeInSeconds = parseTime(publicStartDate);
    
    if(tokenType != 'ERC-721'){
      if (!noofSlots || noofSlots === ''|| noofSlots ==undefined) {
        newErrors.noofSlots = 'Is required';
      }
      if (!vestingDays || vestingDays === ''||vestingDays ==undefined) {
        newErrors.vestingDays = 'Is required';
      }
      if (noofSlots == 0) {
        newErrors.noofSlots = 'claim slots should be greater than zero.' 
      }
      if (vestingDays == 0) {
        newErrors.vestingDays = 'claim vesting time should be greater than zero.'
      }
    }
    
    if (!publicStartDate || publicStartDate === '') {
      newErrors.publicStartDate = 'Is required';
    } else if (publicStartDate && (!dateRegex.test(publicStartDate))) {
      newErrors.publicStartDate = 'Invalid Public Start Date';
    }
    if (!publicEndDate || publicEndDate === '') {
      newErrors.publicEndDate = 'Is required';
    } else if (publicEndDate && (!dateRegex.test(publicEndDate))) {
      newErrors.publicEndDate = 'Invalid Public End Date';
    }
    if (!privateStartDate || privateStartDate === '') {
      newErrors.privateStartDate = 'Is required';
    } else if (privateStartDate && (!dateRegex.test(privateStartDate))) {
      newErrors.privateStartDate = 'Invalid Private Start Date';
    }
    if (!privateEndDate || privateEndDate === '') {
      newErrors.privateEndDate = 'Is required';
    } else if (privateEndDate && (!dateRegex.test(privateEndDate))) {
      newErrors.privateEndDate = 'Invalid Private End Date';
    }
    
    if (timeDate(privateStartDate) > timeDate(privateEndDate)) {
      errorMsg =  'Private Start date cannot be greater than the end date.'

    } else if (timeDate(privateStartDate) === timeDate(privateEndDate)) {
      if (privateStartingTimeInSeconds >= privateEndingTimeInSeconds) {
        errorMsg =  'Private Start time cannot be greater than or equal to the end time.';
      }
    }

    if (timeDate(publicStartDate) > timeDate(publicEndDate)) {
      errorMsg = 'Public Start date cannot be greater than the end date.' ;
    }
     else if (timeDate(publicStartDate) === timeDate(publicEndDate)) {
      if (publicStartingTimeInSeconds >= publicEndingTimeInSeconds) {
        errorMsg =  'Public Start time cannot be greater than or equal to the end time.';
      }
    }
    if (timeDate(publicStartDate) < timeDate(privateEndDate)) {
      errorMsg = 'Round One End Date cannot be greater than the Round Two Start Date.' ;

    }else if (timeDate(publicStartDate) === timeDate(privateEndDate)) {
      if (publicStartingTimeInSeconds < privateEndingTimeInSeconds) {
        errorMsg = 'Round One End time cannot be greater than the Round Two Start time.';

      }
    }
    if (errorMsg.trim() !== '') {
      newErrors.errorMsg = errorMsg;
    }
    return newErrors;
  };
  const parseTime = (timeString ) => {
    const selectedDate =timeString
    const datetime = new Date(selectedDate);
    const selectedTime = datetime.toLocaleTimeString();
    const [times, meridian] = selectedTime.split(' ');
    const [hours, minutes, seconds] = times.split(':').map(Number);
    let totalSeconds = hours * 3600 + minutes * 60 + seconds;
    
    if (meridian?.toLowerCase() === "pm" && hours !== 12) {
      totalSeconds += 12 * 3600;
    } else if (meridian?.toLowerCase() === "am" && hours === 12) {
      totalSeconds -= 12 * 3600;
    }
    
    return totalSeconds;
  };
  const timeDate = (timeString) => {
    if (timeString) {
      return timeString.slice(0, 10);
    } else {
      return '';
    }
  }
 export const validateCastCrewForm = (validatingForm) => {
    const { name, role, bio, webisite, facebook, instagram } = validatingForm ;
    const newErrors = {};
    const urlRegex = /^(?:(?:https?|ftp|file):\/\/|www\.)[^\s/$.?#].[^\s]*$/;
    const emojiRegex = /\p{Emoji}/u;
    const numbersOnly = /^\d+$/;
    const specialCharsOnly = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;

    if (!name || name === '') {
      newErrors.name = 'Is required';
    } else if (!validateContentRules('', name)  || name?.match(numbersOnly) || name?.match(specialCharsOnly)) {
      newErrors.name = 'Accepts alphanumeric and special chars.';
    }
    if (!role || role === '') {
      newErrors.role = 'Is required';
    }
    if (bio && bio.trim() !== '') {
      if (!validateContentRules('', bio) || bio.match(numbersOnly) || bio.match(specialCharsOnly)) {
          newErrors.bio = 'Accepts alphanumeric and special chars.';
      }
  }
    if (webisite && (emojiRegex.test(webisite) || !urlRegex.test(webisite))) {
      newErrors.webisite ='please provide valid content for website';
    }
    if (facebook && (emojiRegex.test(facebook) || !urlRegex.test(facebook))) {
      newErrors.facebook ='please provide valid content for facebook';
    }
    if (instagram && (emojiRegex.test(instagram) || !urlRegex.test(instagram))) {
      newErrors.instagram ='please provide valid content for instagram';
    }
    if (facebook && !urlRegex.test(facebook)) {
      newErrors.facebook = 'please provide valid content for facebook';
    }
    return newErrors;
  }