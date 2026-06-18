import { Request } from "../../types";
import { IRequestRepository } from "../../domain/repositories/IRequestRepository";

export class CreateRequest {
  constructor(private requestRepository: IRequestRepository) {}

  async execute(requestData: any): Promise<Request> {
    return this.requestRepository.create(requestData);
  }
}
