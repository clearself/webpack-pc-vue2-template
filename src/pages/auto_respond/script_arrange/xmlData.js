/* eslint-disable no-undef */
export var xmlStr = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:flowable="http://flowable.org/bpmn" targetNamespace="http://www.flowable.org/processdef">
  <process id="process_1615513481601" name="name_ep6b22mi" isExecutable="true">
    <startEvent id="Event_0gly3pi" name="开始">
      <outgoing>Flow_1oqgbi2</outgoing>
    </startEvent>
    <userTask id="Activity_1bog7jw" name="业务" camunda:candidateUsers="${Activity_1bog7jw_users}" camunda:taskType="2" camunda:approvalUsers="%5B%7B%22dealUserType%22:%220%22%7D%5D" camunda:approvalUsersNames="%5B%7B%22dealUserType%22:%220%22,%22dealUserTypeNmae%22:%22%E5%B7%A5%E5%8D%95%E5%8F%91%E8%B5%B7%E4%BA%BA%22,%22userStr%22:%22%E7%AE%A1%E7%90%86%E5%91%98%22%7D%5D" camunda:warn="%5B%5D" camunda:usersName="%5B%5D" camunda:des="；kl更换积分" camunda:waitTime="13" camunda:waitTimeType="0" camunda:dealType="2">
      <documentation>{"id":"Activity_1bog7jw","type":"2","des":"；kl更换积分","users":[{"dealUserType":"0"}],"waitTime":"13","waitTimeType":"0","warn":[],"dealType":2}</documentation>
      <extensionElements>
        <camunda:taskListener class="com.boot.base.common.util.workflow.TaskCreateListener" event="create" />
        <camunda:taskListener class="com.boot.base.common.util.workflow.TaskCompleteListener" event="complete" />
      </extensionElements>
      <incoming>Flow_1oqgbi2</incoming>
    </userTask>
    <sequenceFlow id="Flow_1oqgbi2" sourceRef="Event_0gly3pi" targetRef="Activity_1bog7jw" />
    <group id="Group_0mh6p36" categoryValueRef="CategoryValue_1p7sxin" />
  </process>
  <category id="Category_18p6x23">
    <categoryValue id="CategoryValue_1p7sxin" />
  </category>
  <bpmndi:BPMNDiagram id="BPMNDiagram_flow">
    <bpmndi:BPMNPlane id="BPMNPlane_flow" bpmnElement="process_1615513481601">
      <bpmndi:BPMNEdge id="Flow_1oqgbi2_di" bpmnElement="Flow_1oqgbi2">
        <di:waypoint x="95" y="90" />
        <di:waypoint x="95" y="139" />
        <di:waypoint x="110" y="139" />
        <di:waypoint x="110" y="188" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="Event_0gly3pi_di" bpmnElement="Event_0gly3pi">
        <omgdc:Bounds x="75" y="50" width="40" height="40" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="84" y="26" width="22" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1bog7jw_di" bpmnElement="Activity_1bog7jw">
        <omgdc:Bounds x="60" y="188" width="100" height="34" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Group_0mh6p36_di" bpmnElement="Group_0mh6p36">
        <omgdc:Bounds x="-70" y="-10" width="330" height="430" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>



`
