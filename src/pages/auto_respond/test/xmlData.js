export var xmlStr = `<?xml version="1.0" encoding="UTF-8"?>
  <definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:flowable="http://flowable.org/bpmn" targetNamespace="http://www.flowable.org/processdef">
    <process name="name_ep6b22mi" isExecutable="true">
      <startEvent id="Event_1ybop0t" name="开始">
        <outgoing>Flow_14o8s7t</outgoing>
      </startEvent>
      <userTask id="Activity_1uoksap" name="业务" camunda:taskType="2" camunda:dealType="0" camunda:approvalUsers="%5B%5D" camunda:approvalUsersNames="%5B%5D" camunda:fieldsReal="%5B%5D" camunda:warn="%5B%5D" camunda:usersName="%5B%5D">
        <documentation>{"id":"Activity_1uoksap","type":2,"des":"","users":[],"waitTime":"","waitTimeType":"","warn":[],"dealType":0,"fields":[]}</documentation>
        <extensionElements>
          <camunda:taskListener class="com.boot.base.common.util.workflow.TaskCreateListener" event="create" />
          <camunda:taskListener class="com.boot.base.common.util.workflow.TaskCompleteListener" event="complete" />
        </extensionElements>
        <incoming>Flow_14o8s7t</incoming>
        <outgoing>Flow_1pnip97</outgoing>
      </userTask>
      <endEvent id="Event_17gw588" name="结束">
        <extensionElements>
          <camunda:executionListener class="com.boot.base.common.util.workflow.EndListener" event="end" />
        </extensionElements>
        <incoming>Flow_1pnip97</incoming>
      </endEvent>
      <sequenceFlow id="Flow_14o8s7t" sourceRef="Event_1ybop0t" targetRef="Activity_1uoksap" />
      <sequenceFlow id="Flow_1pnip97" sourceRef="Activity_1uoksap" targetRef="Event_17gw588" />
    </process>
    <bpmndi:BPMNDiagram id="BPMNDiagram_flow">
      <bpmndi:BPMNPlane id="BPMNPlane_flow" bpmnElement="process_1631071676254">
        <bpmndi:BPMNEdge id="Flow_14o8s7t_di" bpmnElement="Flow_14o8s7t">
          <di:waypoint x="-190" y="130" />
          <di:waypoint x="-30" y="130" />
        </bpmndi:BPMNEdge>
        <bpmndi:BPMNEdge id="Flow_1pnip97_di" bpmnElement="Flow_1pnip97">
          <di:waypoint x="70" y="130" />
          <di:waypoint x="270" y="130" />
        </bpmndi:BPMNEdge>
        <bpmndi:BPMNShape id="Event_17gw588_di" bpmnElement="Event_17gw588">
          <omgdc:Bounds x="270" y="110" width="40" height="40" />
          <bpmndi:BPMNLabel>
            <omgdc:Bounds x="279" y="153" width="22" height="14" />
          </bpmndi:BPMNLabel>
        </bpmndi:BPMNShape>
        <bpmndi:BPMNShape id="Activity_1uoksap_di" bpmnElement="Activity_1uoksap">
          <omgdc:Bounds x="-30" y="113" width="100" height="34" />
        </bpmndi:BPMNShape>
        <bpmndi:BPMNShape id="Event_1ybop0t_di" bpmnElement="Event_1ybop0t">
          <omgdc:Bounds x="-230" y="110" width="40" height="40" />
          <bpmndi:BPMNLabel>
            <omgdc:Bounds x="-221" y="153" width="22" height="14" />
          </bpmndi:BPMNLabel>
        </bpmndi:BPMNShape>
      </bpmndi:BPMNPlane>
    </bpmndi:BPMNDiagram>
  </definitions>`

// `<?xml version="1.0" encoding="UTF-8"?>
// <definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:flowable="http://flowable.org/bpmn" targetNamespace="http://www.flowable.org/processdef">
//   <process name="name_ep6b22mi" isExecutable="true">
//     <startEvent id="Event_0gly3pi" name="开始">
//       <outgoing>Flow_0ntqzcl</outgoing>
//     </startEvent>
//     <serviceTask id="Activity_1x82dil" name="自动" camunda:class="com.boot.base.common.util.workflow.CallExternalSystemDelegate" camunda:taskType="3" camunda:warn="" camunda:usersName="[]">
//       <documentation>{"id":"Activity_1x82dil","type":3,"des":"","warn":[]}</documentation>
//       <incoming>Flow_0ntqzcl</incoming>
//     </serviceTask>
//     <sequenceFlow id="Flow_0ntqzcl" sourceRef="Event_0gly3pi" targetRef="Activity_1x82dil" />
//     <group id="Group_0mh6p36" categoryValueRef="CategoryValue_1p7sxin" />
//   </process>
//   <category id="Category_18p6x23">
//     <categoryValue id="CategoryValue_1p7sxin" />
//   </category>
//   <bpmndi:BPMNDiagram id="BPMNDiagram_flow">
//     <bpmndi:BPMNPlane id="BPMNPlane_flow" bpmnElement="process_1608515956102">
//       <bpmndi:BPMNEdge id="Flow_0ntqzcl_di" bpmnElement="Flow_0ntqzcl">
//         <di:waypoint x="95" y="90" />
//         <di:waypoint x="95" y="225" />
//       </bpmndi:BPMNEdge>
//       <bpmndi:BPMNShape id="Activity_1x82dil_di" bpmnElement="Activity_1x82dil">
//         <omgdc:Bounds x="45" y="225" width="100" height="50" />
//       </bpmndi:BPMNShape>
//       <bpmndi:BPMNShape id="Event_0gly3pi_di" bpmnElement="Event_0gly3pi">
//         <omgdc:Bounds x="75" y="50" width="40" height="40" />
//         <bpmndi:BPMNLabel>
//           <omgdc:Bounds x="84" y="26" width="22" height="14" />
//         </bpmndi:BPMNLabel>
//       </bpmndi:BPMNShape>
//       <bpmndi:BPMNShape id="Group_0mh6p36_di" bpmnElement="Group_0mh6p36">
//         <omgdc:Bounds x="-70" y="-10" width="330" height="430" />
//       </bpmndi:BPMNShape>
//     </bpmndi:BPMNPlane>
//   </bpmndi:BPMNDiagram>
// </definitions>

// `
