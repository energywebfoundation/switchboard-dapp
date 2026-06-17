import { firstValueFrom, Observable } from 'rxjs';
import { EnrolmentClaim } from '../../../routes/enrolment/models/enrolment-claim';

export interface EnrolmentPage {
  enrolments: EnrolmentClaim[];
  skip: number;
  take: number;
  hasNextPage: boolean;
}

export async function loadEnrolmentPage(
  getPage: (skip: number, take: number) => Observable<EnrolmentClaim[]>,
  skip: number,
  take: number
): Promise<EnrolmentPage> {
  const enrolments = await firstValueFrom(getPage(skip, take + 1));

  return {
    enrolments: enrolments.slice(0, take),
    skip,
    take,
    hasNextPage: enrolments.length > take,
  };
}

export async function loadLastEnrolmentPage(
  getPage: (skip: number, take: number) => Observable<EnrolmentClaim[]>,
  skip: number,
  take: number
): Promise<EnrolmentPage> {
  let page = await loadEnrolmentPage(getPage, skip, take);
  const seenPageSignatures = new Set([getPageSignature(page.enrolments)]);
  const maxRequests = 100;
  let requestCount = 1;

  while (page.hasNextPage && requestCount < maxRequests) {
    const nextPage = await loadEnrolmentPage(getPage, page.skip + take, take);
    const nextSignature = getPageSignature(nextPage.enrolments);

    if (seenPageSignatures.has(nextSignature)) {
      return {
        ...page,
        hasNextPage: false,
      };
    }

    seenPageSignatures.add(nextSignature);
    page = nextPage;
    requestCount += 1;
  }

  return {
    ...page,
    hasNextPage: false,
  };
}

export async function loadLastEnrolmentPageFromAll(
  getAll: () => Observable<EnrolmentClaim[]>,
  take: number
): Promise<EnrolmentPage> {
  const enrolments = await firstValueFrom(getAll());
  const lastPageSkip =
    enrolments.length && take
      ? Math.floor((enrolments.length - 1) / take) * take
      : 0;

  return {
    enrolments: enrolments.slice(lastPageSkip, lastPageSkip + take),
    skip: lastPageSkip,
    take,
    hasNextPage: false,
  };
}

function getPageSignature(enrolments: EnrolmentClaim[]): string {
  return enrolments.map((enrolment) => enrolment.id).join('|');
}
