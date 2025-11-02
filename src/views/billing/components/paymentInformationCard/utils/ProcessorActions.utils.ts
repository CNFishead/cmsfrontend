import { StripeActionsHandler } from "./StripeActions.handler";

export class ProcessorActions {
  private processorData: any;
  constructor(processorData: any) {
    this.processorData = processorData;
  }
  async getProcessorActions(processor: string) {
    switch (processor) {
      case 'stripe':
        return new StripeActionsHandler(this.processorData);
      default:
        throw new Error(`Unsupported processor: ${processor}`);
    }
  }
}