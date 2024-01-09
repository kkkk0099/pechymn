
export function HymnType2Name(type, isFullName) {
    var result = "";
    if(isFullName==null) isFullName = false;

    switch (type){
        case 'hymn_a_data':
            result = (isFullName?"平安詩集":"平"); break;
        case 'hymn_b_data':
            result = (isFullName?"敬拜頌歌":"敬"); break;
        case 'hymn_c_data':
            result = (isFullName?"詩歌集":"詩"); break;
    }
    return result;  
  }