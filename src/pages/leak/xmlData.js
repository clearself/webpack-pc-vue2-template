export var xmlStr = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:bioc="http://bpmn.io/schema/bpmn/biocolor/1.0" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:flowable="http://flowable.org/bpmn" targetNamespace="http://www.flowable.org/processdef">
  <process name="name_51rktajo" isExecutable="true">
    <startEvent id="Event_1scuuda" name="开始">
      <outgoing>Flow_12tswzo</outgoing>
    </startEvent>
    <serviceTask id="Activity_1sk64pw" name="自动" camunda:taskType="3" camunda:warn="" camunda:usersName="">
      <documentation>{"id":"Activity_1sk64pw","type":3,"des":"","warn":[]}</documentation>
      <incoming>Flow_12tswzo</incoming>
    </serviceTask>
    <sequenceFlow id="Flow_12tswzo" sourceRef="Event_1scuuda" targetRef="Activity_1sk64pw" />
    <group id="Group_078m0lh" categoryValueRef="CategoryValue_0zz154u" name="阶段" color="#1cd7fa" />
  </process>
  <category id="Category_1oq6om6">
    <categoryValue id="CategoryValue_0zz154u" value="阶段" />
  </category>
  <bpmndi:BPMNDiagram id="BPMNDiagram_flow">
    <bpmndi:BPMNPlane id="BPMNPlane_flow" bpmnElement="process_1607939964568">
      <bpmndi:BPMNEdge id="Flow_12tswzo_di" bpmnElement="Flow_12tswzo">
        <di:waypoint x="-20" y="-30" />
        <di:waypoint x="-20" y="45" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="Event_1scuuda_di" bpmnElement="Event_1scuuda">
        <omgdc:Bounds x="-40" y="-70" width="40" height="40" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="-31" y="-94" width="22" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1sk64pw_di" bpmnElement="Activity_1sk64pw">
        <omgdc:Bounds x="-60" y="45" width="100" height="50" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Group_078m0lh_di" bpmnElement="Group_078m0lh" bioc:stroke="#1cd7fa" bioc:fill="#1cd7fa">
        <omgdc:Bounds x="-140" y="-150" width="240" height="320" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="-31" y="-143" width="23" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>


`
