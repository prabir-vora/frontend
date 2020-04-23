import { createActionTypes } from 'stores/lib';
import { fetchGraphQL } from 'constants/graphql';

// Duck Name
const duckName = 'NO_OF_LIKES';

const fetchNumberOfLikes = productID => dispatch => {
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
            query {
                fetchNumberOfLikes(productID: "${productID}") 
            }
        `).then(res => {
      if (
        res !== null &&
        res !== undefined &&
        res.fetchNumberOfLikes !== null &&
        res.fetchNumberOfLikes !== undefined
      ) {
        resolve(res.fetchNumberOfLikes);
      } else {
        resolve(null);
      }
    });
  });
};

export default {
  actionCreators: {
    fetchNumberOfLikes,
  },
};
