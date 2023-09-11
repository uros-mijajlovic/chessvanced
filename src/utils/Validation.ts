export namespace Validation{
    export function isTwoNumberArray(data){
        if (!Array.isArray(data)) {
            return false;
          }
          if (data.length === 2 && typeof data[0] === 'number' && typeof data[1] === 'number') {
            return true;
          }
          return false;
    }
}