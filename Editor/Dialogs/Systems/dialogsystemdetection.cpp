/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystemdetection.h"
#include "ui_dialogsystemdetection.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------


DialogSystemDetection::DialogSystemDetection(SystemDetection &detection, QWidget
    *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemDetection),
    m_detection(detection)
{
    ui->setupUi(this);

    this->initialize();
}

DialogSystemDetection::~DialogSystemDetection()
{
    delete ui;
    delete m_position;
    delete m_positionObject;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemDetection::initialize() {
    ui->lineEditName->setText(m_detection.name());
    ui->spinBoxFieldLeft->setValue(m_detection.fieldLeft());
    ui->spinBoxFieldRight->setValue(m_detection.fieldRight());
    ui->spinBoxFieldTop->setValue(m_detection.fieldTop());
    ui->spinBoxFieldBot->setValue(m_detection.fieldBot());
    ui->spinBoxWidth->hide();

    m_position = new QVector3D;
    m_positionObject = new QVector3D;
    m_detection.getTargetPosition(m_position);
    ui->widgetMapEditor->needUpdateMapDetection(&m_detection, m_position,
        m_positionObject, 400, -129, Camera::defaultVAngle);
    ui->widgetMapEditor->setFocus();
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogSystemDetection::on_lineEditName_textChanged(const QString &text) {
    m_detection.setName(text);
}

// -------------------------------------------------------

void DialogSystemDetection::on_spinBoxFieldLeft_valueChanged(int i) {
    m_detection.setFieldLeft(i);
}

// -------------------------------------------------------

void DialogSystemDetection::on_spinBoxFieldRight_valueChanged(int i) {
    m_detection.setFieldRight(i);
}

// -------------------------------------------------------

void DialogSystemDetection::on_spinBoxFieldTop_valueChanged(int i) {
    m_detection.setFieldTop(i);
}

// -------------------------------------------------------

void DialogSystemDetection::on_spinBoxFieldBot_valueChanged(int i) {
    m_detection.setFieldBot(i);
}

// -------------------------------------------------------

void DialogSystemDetection::on_comboBoxAutomatic_currentIndexChanged(int index)
{

}

// -------------------------------------------------------

void DialogSystemDetection::on_pushButtonGenerate_pressed() {

}
