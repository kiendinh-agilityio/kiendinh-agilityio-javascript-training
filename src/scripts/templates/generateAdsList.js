import { adsItem } from './adsItem';

export const generateListAds = (items) => {
  return `
    <div class="table-container">
      <ul class="flex flex-wrap justify-between table-row thead">
        <li>Network</li>
        <li>Status</li>
        <li>Email</li>
        <li>Phone</li>
        <li></li>
      </ul>
      <div class="flex-column flex-wrap tbody">
        ${items
          .map((item) => {
            return adsItem(item);
          })
          .join('')}
      </div>
    </div>
  `;
};