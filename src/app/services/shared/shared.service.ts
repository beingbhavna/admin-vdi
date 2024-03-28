import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { MessageService } from 'ngx-i2k2-message-lib';
import { AuthService } from '../../services/auth/auth.service';
import { HandelError } from 'src/app/shared/enumrations/app-enum.enumerations';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  public serverName: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public selectedAction: BehaviorSubject<any> = new BehaviorSubject<any>("");
  public vdiData: BehaviorSubject<any> = new BehaviorSubject<any>("");
  //public examPreviewParams: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public examPreviewParams: any;
  public selectedExamLabelShift: BehaviorSubject<any> = new BehaviorSubject<any>("0");
  public clearAllExam: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  public autoAllExam: BehaviorSubject<any> = new BehaviorSubject<any>(false);

  constructor(
    private router: Router,
    private restService: GlobalRestService,
    private messageService: MessageService,
    private authService: AuthService
  ) {
  }

  setLoaderVisibility(showLoader: boolean) {

    const spinner = document.getElementsByClassName('spinner')[0];
    if (showLoader) {
      if (spinner.classList.contains('hidden')) {
        spinner.classList.remove('hidden');
        spinner.classList.add('visible');
      }
    }
    else {
      if (spinner.classList.contains('visible')) {
        spinner.classList.remove('visible');
        spinner.classList.add('hidden');
      }
    }
  }

  redirectToNextQuestion(QuestionDetails, orderId, examGuid) {

    let detailId = QuestionDetails.question[0].detail_id;
    let questionsCount = QuestionDetails.requirement_details.length;
    let indexOfCurrentQuestion = QuestionDetails.requirement_details.findIndex(i => i.detail_id == detailId);
    if (indexOfCurrentQuestion > -1 && ((indexOfCurrentQuestion + 1) < questionsCount)) {
      let nextQuestionDetailId = QuestionDetails.requirement_details[indexOfCurrentQuestion + 1].detail_id;
      let nextQuestionAnswerType = QuestionDetails.requirement_details[indexOfCurrentQuestion + 1].answer_type;

      let isAuthor = QuestionDetails.requirement_details[indexOfCurrentQuestion + 1].author;
      let isReviewer = QuestionDetails.requirement_details[indexOfCurrentQuestion + 1].reviewer;
      let isApprover = QuestionDetails.requirement_details[indexOfCurrentQuestion + 1].approver;
      let isPrimaryQuestion = QuestionDetails.requirement_details[indexOfCurrentQuestion + 1].primary_question;
      let isPrincipalApprover = QuestionDetails.requirement_details[indexOfCurrentQuestion + 1].principal_approver;
      let sentToPrincipalApprover = QuestionDetails.requirement_details[indexOfCurrentQuestion + 1].sent_to_principal_approver;
      let authoring = ["Pending", "Created", "Modified", "In Authoring", "Sent Back To Author"];
      let reviewing = ["Review Pending", "In Review"];
      let approving = ["In Approval", "Approved"];
      let nextQuestionStatus = QuestionDetails.requirement_details[indexOfCurrentQuestion + 1].completion_status_text;

      if (isPrimaryQuestion == "1") {
        if (nextQuestionStatus == 'Sent Back To Author' && isAuthor == "1") {
          this.resumePrimaryQuestion(QuestionDetails.requirement_details[indexOfCurrentQuestion + 1], orderId, examGuid)
        }
        else if (authoring.includes(nextQuestionStatus) && isAuthor == "1") {
          this.router.navigate(["/author/questions/orders/" + orderId + "/exams/" + examGuid + "/details/" + nextQuestionDetailId + "/types/" + nextQuestionAnswerType + "/add/primary"]);
        }
        else if (reviewing.includes(nextQuestionStatus) && isReviewer == "1") {
          this.router.navigate(["/author/questions/orders/" + orderId + "/exams/" + examGuid + "/details/" + nextQuestionDetailId + "/types/" + nextQuestionAnswerType + "/review/primary"]);
        }
        else if (approving.includes(nextQuestionStatus) && isApprover == "1" && sentToPrincipalApprover != '1') {
          this.router.navigate(["/author/questions/orders/" + orderId + "/exams/" + examGuid + "/details/" + nextQuestionDetailId + "/types/" + nextQuestionAnswerType + "/approve/primary"]);
        }
        else if (approving.includes(nextQuestionStatus) && isPrincipalApprover == "1" && sentToPrincipalApprover == '1') {
          this.router.navigate(["/author/questions/orders/" + orderId + "/exams/" + examGuid + "/details/" + nextQuestionDetailId + "/types/" + nextQuestionAnswerType + "/approve/primary"]);
        }
        else {
          this.router.navigate(["/author/questions/orders/" + orderId + "/exams/" + examGuid + "/details/" + nextQuestionDetailId + "/types/" + nextQuestionAnswerType + "/view/primary"]);
        }
      }
      else {
        if (nextQuestionStatus == 'Sent Back To Author' && isAuthor == "1") {
          this.resumeSecondaryQuestion(QuestionDetails.requirement_details[indexOfCurrentQuestion + 1], orderId, examGuid)
        }
        else if (authoring.includes(nextQuestionStatus) && isAuthor == "1") {
          this.router.navigate(["/author/questions/orders/" + orderId + "/exams/" + examGuid + "/details/" + nextQuestionDetailId + "/types/" + nextQuestionAnswerType + "/add/secondary"]);
        }
        else if (reviewing.includes(nextQuestionStatus) && isReviewer == "1") {
          this.router.navigate(["/author/questions/orders/" + orderId + "/exams/" + examGuid + "/details/" + nextQuestionDetailId + "/types/" + nextQuestionAnswerType + "/review/secondary"]);
        }
        else if (approving.includes(nextQuestionStatus) && isApprover == "1" && sentToPrincipalApprover != '1') {
          this.router.navigate(["/author/questions/orders/" + orderId + "/exams/" + examGuid + "/details/" + nextQuestionDetailId + "/types/" + nextQuestionAnswerType + "/approve/secondary"]);
        }
        else if (approving.includes(nextQuestionStatus) && isPrincipalApprover == "1" && sentToPrincipalApprover == '1') {
          this.router.navigate(["/author/questions/orders/" + orderId + "/exams/" + examGuid + "/details/" + nextQuestionDetailId + "/types/" + nextQuestionAnswerType + "/approve/secondary"]);
        }
        else {
          this.router.navigate(["/author/questions/orders/" + orderId + "/exams/" + examGuid + "/details/" + nextQuestionDetailId + "/types/" + nextQuestionAnswerType + "/view/secondary"]);
        }
      }

    }
    else{
      let isPrimaryQuestion = QuestionDetails.requirement_details[indexOfCurrentQuestion].primary_question;
      let currentQuestionDetailId = QuestionDetails.requirement_details[indexOfCurrentQuestion].detail_id;
      let currentQuestionAnswerType = QuestionDetails.requirement_details[indexOfCurrentQuestion].answer_type;
      if (isPrimaryQuestion == "1") {
        this.router.navigate(["/author/questions/orders/" + orderId + "/exams/" + examGuid + "/details/" + currentQuestionDetailId + "/types/" + currentQuestionAnswerType + "/view/primary"]);
      }
      else{
        this.router.navigate(["/author/questions/orders/" + orderId + "/exams/" + examGuid + "/details/" + currentQuestionDetailId + "/types/" + currentQuestionAnswerType + "/view/secondary"]);
      }
    }

  }

  redirectToPreviousQuestion(QuestionDetails, orderId, examGuid) {
    let detailId = QuestionDetails.question[0].detail_id;
    let questionsCount = QuestionDetails.requirement_details.length;
    let indexOfCurrentQuestion = QuestionDetails.requirement_details.findIndex(i => i.detail_id == detailId);
    if (indexOfCurrentQuestion > 0 && ((indexOfCurrentQuestion) < questionsCount)) {
      let prevQuestionDetailId = QuestionDetails.requirement_details[indexOfCurrentQuestion - 1].detail_id;
      let prevQuestionAnswerType = QuestionDetails.requirement_details[indexOfCurrentQuestion - 1].answer_type;

      let isAuthor = QuestionDetails.requirement_details[indexOfCurrentQuestion - 1].author;
      let isReviewer = QuestionDetails.requirement_details[indexOfCurrentQuestion - 1].reviewer;
      let isApprover = QuestionDetails.requirement_details[indexOfCurrentQuestion - 1].approver;
      let isPrincipalApprover = QuestionDetails.requirement_details[indexOfCurrentQuestion - 1].principal_approver;
      let sentToPrincipalApprover = QuestionDetails.requirement_details[indexOfCurrentQuestion - 1].sent_to_principal_approver;
      let isPrimaryQuestion = QuestionDetails.requirement_details[indexOfCurrentQuestion - 1].primary_question;
      let authoring = ["Pending", "Created", "Modified", "In Authoring", "Sent Back To Author"];
      let reviewing = ["Review Pending", "In Review"];
      let approving = ["In Approval", "Approved"];
      let previousQuestionStatus = QuestionDetails.requirement_details[indexOfCurrentQuestion - 1].completion_status_text;

      if (isPrimaryQuestion == "1") {
        if (previousQuestionStatus == 'Sent Back To Author' && isAuthor == "1") {
          this.resumePrimaryQuestion(QuestionDetails.requirement_details[indexOfCurrentQuestion - 1], orderId, examGuid)
        }
        else if (authoring.includes(previousQuestionStatus) && isAuthor == "1") {
          this.router.navigate(["/author/questions/orders/" + orderId + "/exams/" + examGuid + "/details/" + prevQuestionDetailId + "/types/" + prevQuestionAnswerType + "/add/primary"]);
        }
        else if (reviewing.includes(previousQuestionStatus) && isReviewer == "1") {
          this.router.navigate(["/author/questions/orders/" + orderId + "/exams/" + examGuid + "/details/" + prevQuestionDetailId + "/types/" + prevQuestionAnswerType + "/review/primary"]);
        }
        else if (approving.includes(previousQuestionStatus) && isApprover == "1" && sentToPrincipalApprover != '1') {
          this.router.navigate(["/author/questions/orders/" + orderId + "/exams/" + examGuid + "/details/" + prevQuestionDetailId + "/types/" + prevQuestionAnswerType + "/approve/primary"]);
        }
        else if (approving.includes(previousQuestionStatus) && isPrincipalApprover == "1" && sentToPrincipalApprover == '1') {
          this.router.navigate(["/author/questions/orders/" + orderId + "/exams/" + examGuid + "/details/" + prevQuestionDetailId + "/types/" + prevQuestionAnswerType + "/approve/primary"]);
        }
        else {
          this.router.navigate(["/author/questions/orders/" + orderId + "/exams/" + examGuid + "/details/" + prevQuestionDetailId + "/types/" + prevQuestionAnswerType + "/view/primary"]);
        }
      }
      else {
        if (previousQuestionStatus == 'Sent Back To Author' && isAuthor == "1") {
          this.resumeSecondaryQuestion(QuestionDetails.requirement_details[indexOfCurrentQuestion + 1], orderId, examGuid)
        }
        else if (authoring.includes(previousQuestionStatus) && isAuthor == "1") {
          this.router.navigate(["/author/questions/orders/" + orderId + "/exams/" + examGuid + "/details/" + prevQuestionDetailId + "/types/" + prevQuestionAnswerType + "/add/secondary"]);
        }
        else if (reviewing.includes(previousQuestionStatus) && isReviewer == "1") {
          this.router.navigate(["/author/questions/orders/" + orderId + "/exams/" + examGuid + "/details/" + prevQuestionDetailId + "/types/" + prevQuestionAnswerType + "/review/secondary"]);
        }
        else if (approving.includes(previousQuestionStatus) && isApprover == "1" && sentToPrincipalApprover != '1') {
          this.router.navigate(["/author/questions/orders/" + orderId + "/exams/" + examGuid + "/details/" + prevQuestionDetailId + "/types/" + prevQuestionAnswerType + "/approve/secondary"]);
        }
        else if (approving.includes(previousQuestionStatus) && isPrincipalApprover == "1" && sentToPrincipalApprover == '1') {
          this.router.navigate(["/author/questions/orders/" + orderId + "/exams/" + examGuid + "/details/" + prevQuestionDetailId + "/types/" + prevQuestionAnswerType + "/approve/secondary"]);
        }
        else {
          this.router.navigate(["/author/questions/orders/" + orderId + "/exams/" + examGuid + "/details/" + prevQuestionDetailId + "/types/" + prevQuestionAnswerType + "/view/secondary"]);
        }
      }

    }

  }

  resumePrimaryQuestion(questionDetails, orderId, examGuid) {
    this.selectedAction.next('Resume');
    let keyData = [
      {
        "name": "orderId",
        "value": orderId
      },
      {
        "name": "examGuid",
        "value": examGuid
      }
    ];

    let serverGuid = this.authService.getUserUniqueId();
    let postParams = {
      "local_endpoint_object": {
        "user_guid": serverGuid,
        "order_id": orderId,
        "exam_guid": examGuid,
        "endpoint_type": "ADMIN"
      },
      "detail_id": questionDetails.detail_id,
      "action": "Sent Back To Author"
    }

    // this.restService.ApiEndPointUrlOrKey = Admin.changeStatus;
    this.restService.HttpPostParams = postParams;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    this.restService.ShowLoadingSpinner = true;
    this.restService.callApi(keyData)
      .subscribe(sucessResponse => {
        this.router.navigate(["/author/questions/orders/" + orderId + "/exams/" + examGuid + "/details/" + questionDetails.detail_id + "/types/" + questionDetails.answer_type + "/add/primary"]);
      }, errorResponse => {
        this.messageService.okRedirectModal(errorResponse.httpErrorResponse, 'ERROR', 'OK').subscribe(result => {
          this.messageService.hideModal();
        })
      });
  }

  resumeSecondaryQuestion(questionDetails, orderId, examGuid) {
    this.selectedAction.next('Resume');
    let keyData = [
      {
        "name": "orderId",
        "value": orderId
      },
      {
        "name": "examGuid",
        "value": examGuid
      }
    ];

    let serverGuid = this.authService.getUserUniqueId();
    let postParams = {
      "local_endpoint_object": {
        "user_guid": serverGuid,
        "order_id": orderId,
        "exam_guid": examGuid,
        "endpoint_type": "ADMIN"
      },
      "detail_id": questionDetails.detail_id,
      "action": "Sent Back To Author"
    }

    // this.restService.ApiEndPointUrlOrKey = Admin.changeStatus;
    this.restService.HttpPostParams = postParams;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    this.restService.ShowLoadingSpinner = true;
    this.restService.callApi(keyData)
      .subscribe(sucessResponse => {
        this.router.navigate(['/author/questions/orders/' + orderId + '/exams/' + examGuid + '/details/' + questionDetails.detail_id + '/types/' + questionDetails.answer_type + '/add/secondary']);
      }, errorResponse => {
        this.messageService.okRedirectModal(errorResponse.httpErrorResponse, 'ERROR', 'OK').subscribe(result => {
          this.messageService.hideModal();
        })
      });
  }

  errorAlert(errorResponse){
    //showing message when user is not logged in
    if (errorResponse.httpErrorResponse.data[0].attributes.message[0] == "Invalid Token") {
      //showing message when user is token is expired
      const successMessage = { "http_status": "200", "data": [{ "type": "VALID_RETURN", "attributes": { "message_type": "", "message": ["Session Timeout, Please Login Again."] }, "data": null }] };
      this.messageService.okRedirectModal(successMessage, 'ERROR', 'OK').subscribe(result => {
        this.authService.logout();
        this.router.navigate(['/login']);
        this.messageService.hideModal();
      });
    }
    else{
      this.messageService.okRedirectModal(errorResponse.httpErrorResponse, 'ERROR', 'OK').subscribe(result => {
        this.messageService.hideModal();
      })
    }
  }

  getPrimaryQuestionDetails(orderId, detailId, answerType, examGuid ) {
    let selectedExamLabelShift = "0";
    this.selectedExamLabelShift.subscribe(value => {
      selectedExamLabelShift = value;
    });

    var keyData = [

      {
        "name": "orderId",
        "value": orderId
      },
      {
        "name": "detailId",
        "value": detailId
      },
      {
        "name": "answerType",
        "value": answerType
      },
      {
        "name": "examGuid",
        "value": examGuid
      },
      {
        "name": "shiftNumber",
        "value": selectedExamLabelShift
      }
    ];

    let serverGuid = this.authService.getUserUniqueId();

    let postParams = {
      "local_endpoint_object": {
        "user_guid": serverGuid,
        "order_id": orderId,
        "exam_guid": examGuid,
        "endpoint_type": "ADMIN"
      },
      "httpExamsPostParams": {
        "examFilter": {
          "httpFilter": {
            "examNumber": "",
            "gradeTypeGuid": "",
            "planStatusGuid": "",
            "examGuid": "",
            "examPublicLabel": ""
          },
          "httpPaging": {
            "lastSeenIdMax": 0,
            "lastSeenIdMin": 0,
            "lastOffset": 0,
            "pageSize": 0,
            "sortBy": "",
            "sortOrderDirection": "",
            "direction": 0,
            "pageNumber": 0,
            "sortExpression": "",
            "sortDirection": "",
            "totalRows": 0
          },
          "httpColumns": []
        }
      }
    };

    // this.restService.ApiEndPointUrlOrKey = Admin.getPrimaryQuestionDetails;
    this.restService.HttpPostParams = postParams;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
    this.restService.ShowLoadingSpinner = true;
    this.restService.callApi(keyData)
      .subscribe(sucessResponse => {
        let QuestionDetails = sucessResponse;

        let indexOfCurrentQuestion = QuestionDetails.requirement_details.findIndex(i => i.detail_id == detailId);

          let currentQuestionDetailId = QuestionDetails.requirement_details[indexOfCurrentQuestion].detail_id;
          let currentQuestionAnswerType = QuestionDetails.requirement_details[indexOfCurrentQuestion].answer_type;

          let isAuthor = QuestionDetails.requirement_details[indexOfCurrentQuestion].author;
          let isReviewer = QuestionDetails.requirement_details[indexOfCurrentQuestion].reviewer;
          let isApprover = QuestionDetails.requirement_details[indexOfCurrentQuestion].approver;
          // let authoring = ["Pending", "Created", "Modified", "In Authoring", "Sent Back To Author"];
          let authoring = ["Pending", "Modified", "In Authoring", "Sent Back To Author"];
          let reviewing = ["Review Pending", "In Review"];
          // let approving = ["In Approval", "Approved"];
          let approving = ["In Approval"];
          let currentQuestionStatus = QuestionDetails.requirement_details[indexOfCurrentQuestion].completion_status_text;

          if (currentQuestionStatus == 'Sent Back To Author' && isAuthor == "1") {
            this.resumePrimaryQuestion(QuestionDetails.requirement_details[indexOfCurrentQuestion], orderId, examGuid)
          }
          else if (authoring.includes(currentQuestionStatus) && isAuthor == "1") {
            this.router.navigate(["/author/questions/orders/" + orderId + "/exams/" + examGuid + "/details/" + currentQuestionDetailId + "/types/" + currentQuestionAnswerType + "/add/primary"]);
          }
          else if (reviewing.includes(currentQuestionStatus) && isReviewer == "1") {
            this.router.navigate(["/author/questions/orders/" + orderId + "/exams/" + examGuid + "/details/" + currentQuestionDetailId + "/types/" + currentQuestionAnswerType + "/review/primary"]);
          }
          else if (approving.includes(currentQuestionStatus) && isApprover == "1") {
            this.router.navigate(["/author/questions/orders/" + orderId + "/exams/" + examGuid + "/details/" + currentQuestionDetailId + "/types/" + currentQuestionAnswerType + "/approve/primary"]);
          }
          else {
            this.router.navigate(["/author/questions/orders/" + orderId + "/exams/" + examGuid + "/details/" + currentQuestionDetailId + "/types/" + currentQuestionAnswerType + "/view/primary"]);
          }


      }, errorResponse => {
        this.errorAlert(errorResponse);
      });
  }

  getSecondaryQuestionDetails(orderId, detailId, answerType, examGuid) {

    let selectedExamLabelShift = "0";
    this.selectedExamLabelShift.subscribe(value => {
      selectedExamLabelShift = value;
    });

    var keyData = [

      {
        "name": "orderId",
        "value": orderId
      },
      {
        "name": "detailId",
        "value": detailId
      },
      {
        "name": "answerType",
        "value": answerType
      },
      {
        "name": "examGuid",
        "value": examGuid
      },
      {
        "name": "shiftNumber",
        "value": selectedExamLabelShift
      }
    ];

    let serverGuid = this.authService.getUserUniqueId();

    let postParams = {
      "local_endpoint_object": {
        "user_guid": serverGuid,
        "order_id": orderId,
        "exam_guid": examGuid,
        "endpoint_type": "AUTHORING"
      },
      "httpExamsPostParams": {
        "examFilter": {
          "httpFilter": {
            "examNumber": "",
            "gradeTypeGuid": "",
            "planStatusGuid": "",
            "examGuid": "",
            "examPublicLabel": ""
          },
          "httpPaging": {
            "lastSeenIdMax": 0,
            "lastSeenIdMin": 0,
            "lastOffset": 0,
            "pageSize": 0,
            "sortBy": "",
            "sortOrderDirection": "",
            "direction": 0,
            "pageNumber": 0,
            "sortExpression": "",
            "sortDirection": "",
            "totalRows": 0
          },
          "httpColumns": []
        }
      }
    };


    this.restService.HttpPostParams = postParams;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
    this.restService.ShowLoadingSpinner = true;
    this.restService.callApi(keyData)
      .subscribe(sucessResponse => {
        let QuestionDetails = sucessResponse;

        let detailId = QuestionDetails.question[0].detail_id;
        let indexOfCurrentQuestion = QuestionDetails.requirement_details.findIndex(i => i.detail_id == detailId);
        if (indexOfCurrentQuestion > -1) {

          let currentQuestionDetailId = QuestionDetails.requirement_details[indexOfCurrentQuestion].detail_id;
          let currentQuestionAnswerType = QuestionDetails.requirement_details[indexOfCurrentQuestion].answer_type;

          let isAuthor = QuestionDetails.requirement_details[indexOfCurrentQuestion].author;
          let isReviewer = QuestionDetails.requirement_details[indexOfCurrentQuestion].reviewer;
          let isApprover = QuestionDetails.requirement_details[indexOfCurrentQuestion].approver;
          // let authoring = ["Pending", "Created", "Modified", "In Authoring", "Sent Back To Author"];
          let authoring = ["Pending", "Modified", "In Authoring", "Sent Back To Author"];
          let reviewing = ["Review Pending", "In Review"];
          // let approving = ["In Approval", "Approved"];
          let approving = ["In Approval"];
          let currentQuestionStatus = QuestionDetails.requirement_details[indexOfCurrentQuestion].completion_status_text;

          if (currentQuestionStatus == 'Sent Back To Author' && isAuthor == "1") {
            this.resumeSecondaryQuestion(QuestionDetails.requirement_details[indexOfCurrentQuestion], orderId, examGuid)
          }
          else if (authoring.includes(currentQuestionStatus) && isAuthor == "1") {
            this.router.navigate(["/author/questions/orders/" + orderId + "/exams/" + examGuid + "/details/" + currentQuestionDetailId + "/types/" + currentQuestionAnswerType + "/add/secondary"]);
          }
          else if (reviewing.includes(currentQuestionStatus) && isReviewer == "1") {
            this.router.navigate(["/author/questions/orders/" + orderId + "/exams/" + examGuid + "/details/" + currentQuestionDetailId + "/types/" + currentQuestionAnswerType + "/review/secondary"]);
          }
          else if (approving.includes(currentQuestionStatus) && isApprover == "1") {
            this.router.navigate(["/author/questions/orders/" + orderId + "/exams/" + examGuid + "/details/" + currentQuestionDetailId + "/types/" + currentQuestionAnswerType + "/approve/secondary"]);
          }
          else {
            this.router.navigate(["/author/questions/orders/" + orderId + "/exams/" + examGuid + "/details/" + currentQuestionDetailId + "/types/" + currentQuestionAnswerType + "/view/secondary"]);
          }

        }


      }, errorResponse => {
        this.errorAlert(errorResponse);
      });
  }


}
