/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystemdetection.h"
#include "ui_dialogsystemdetection.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemDetection::DialogSystemDetection(SystemDetection &detection, QWidget
    *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemDetection),
    m_detection(detection),
    m_position(new QVector3D),
    m_positionObject(new QVector3D),
    m_radius(1),
    m_length(1),
    m_cameraDistance(SystemDetection::DEFAULT_CAMERA_DISTANCE),
    m_cameraHorizontalAngle(SystemDetection::DEFAULT_CAMERA_HORIZONTAL_ANGLE),
    m_cameraVerticalAngle(Camera::defaultVAngle),
    m_first(true)
{
    ui->setupUi(this);
    ui->widgetMapEditor->setMenus(ui->widgetMenuBarMapEditor, nullptr);
    ui->widgetMenuBarMapEditor->initializeRightMenu(true);
    ui->widgetMenuBarMapEditor->setDetection();
    ui->comboBoxAutomatic->addItem(RPM::translate(Translations::CIRCLE));
    ui->comboBoxAutomatic->addItem(RPM::translate(Translations::RECTANGLE));
    this->initialize();
    this->translate();
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
    ui->labelWidth->hide();
    ui->spinBoxWidth->hide();
    ui->spinBoxLengthPixels->setMaximum(RPM::getSquareSize() - 1);
    ui->spinBoxWidthPixels->setMaximum(RPM::getSquareSize() - 1);
    ui->spinBoxHeightPixels->setMaximum(RPM::getSquareSize() - 1);
    m_detection.getTargetPosition(m_position);
    this->updateMap();
}

// -------------------------------------------------------

void DialogSystemDetection::updateMap() {
    m_detection.removeLimitDetections();
    m_detection.getTargetPosition(m_positionObject);
    if (!m_first) {
        m_cameraDistance = ui->widgetMapEditor->cameraDistance();
        m_cameraHorizontalAngle = ui->widgetMapEditor->cameraHorizontalAngle();
        m_cameraVerticalAngle = ui->widgetMapEditor->cameraVerticalAngle();
        ui->widgetMapEditor->deleteMap();
    } else {
        m_first = false;
    }
    ui->widgetMapEditor->needUpdateMapDetection(&m_detection, m_position,
        m_positionObject, m_cameraDistance, m_cameraHorizontalAngle,
        m_cameraVerticalAngle);
}

//-------------------------------------------------

void DialogSystemDetection::translate()
{
    this->setWindowTitle(RPM::translate(Translations::SET_DETECTION) + RPM
        ::DOT_DOT_DOT);
    ui->labelBot->setText(RPM::translate(Translations::BOT) + RPM::COLON);
    ui->labelTop->setText(RPM::translate(Translations::TOP) + RPM::COLON);
    ui->labelLeft->setText(RPM::translate(Translations::LEFT) + RPM::COLON);
    ui->labelName->setText(RPM::translate(Translations::NAME) + RPM::COLON);
    ui->labelRight->setText(RPM::translate(Translations::RIGHT) + RPM::COLON);
    ui->labelWidth->setText(RPM::translate(Translations::WIDTH) + RPM::COLON);
    ui->labelPixels->setText(RPM::translate(Translations::PIXEL_S));
    ui->labelSquares->setText(RPM::translate(Translations::SQUARE_S));
    ui->labelPixels_2->setText(RPM::translate(Translations::PIXEL_S));
    ui->labelSquares_2->setText(RPM::translate(Translations::SQUARE_S));
    ui->labelPixels_3->setText(RPM::translate(Translations::PIXEL_S));
    ui->labelSquares_3->setText(RPM::translate(Translations::SQUARE_S));
    ui->labelDescription->setText(RPM::translate(Translations
        ::DETECTION_DESCRIPTION));
    ui->labelRadiusLength->setText(RPM::translate(Translations::RADIUS) + RPM
        ::COLON);
    ui->groupBoxField->setTitle(RPM::translate(Translations::FIELD));
    ui->groupBoxAutomatic->setTitle(RPM::translate(Translations::AUTOMATIC));
    ui->groupBoxNewBoxLength->setTitle(RPM::translate(Translations
        ::NEW_BOX_LENGTH));
    ui->groupBoxNewBoxWidth->setTitle(RPM::translate(Translations
        ::NEW_BOX_WIDTH));
    ui->groupBoxNewBoxHeight->setTitle(RPM::translate(Translations
        ::NEW_BOX_HEIGHT));
    ui->pushButtonGenerate->setText(RPM::translate(Translations::GENERATE));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
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
    int dif;
    float x;

    dif = i - m_detection.fieldLeft();
    m_detection.setFieldLeft(i);
    x = m_position->x() + dif * RPM::getSquareSize();
    if (x >= 0) {
        m_position->setX(x);
    }
    this->updateMap();
}

// -------------------------------------------------------

void DialogSystemDetection::on_spinBoxFieldRight_valueChanged(int i) {
    int dif;
    float x;

    dif = i - m_detection.fieldRight();
    m_detection.setFieldRight(i);
    x = m_position->x() + dif * RPM::getSquareSize();
    if (dif < 0 && x >= 0 && x >= ((m_detection.fieldLeft() + m_detection
        .fieldRight()) * RPM::getSquareSize()))
    {
        m_position->setX(x);
    }
    this->updateMap();
}

// -------------------------------------------------------

void DialogSystemDetection::on_spinBoxFieldTop_valueChanged(int i) {
    int dif;
    float z;

    dif = i - m_detection.fieldTop();
    m_detection.setFieldTop(i);
    z = m_position->z() + dif * RPM::getSquareSize();
    if (z >= 0) {
        m_position->setZ(z);
    }
    this->updateMap();
}

// -------------------------------------------------------

void DialogSystemDetection::on_spinBoxFieldBot_valueChanged(int i) {
    int dif;
    float z;

    dif = i - m_detection.fieldBot();
    m_detection.setFieldBot(i);
    z = m_position->z() + dif * RPM::getSquareSize();
    if (dif < 0 && z >= 0 && z >= ((m_detection.fieldTop() + m_detection
        .fieldBot()) * RPM::getSquareSize()))
    {
        m_position->setZ(z);
    }
    this->updateMap();
}

// -------------------------------------------------------

void DialogSystemDetection::on_spinBoxLengthSquares_valueChanged(int i) {
    m_detection.setCurrentLengthSquares(i);
}

// -------------------------------------------------------

void DialogSystemDetection::on_spinBoxLengthPixels_valueChanged(int i) {
    m_detection.setCurrentLengthPixels(static_cast<double>(i) / RPM
        ::getSquareSize() * 100.0);
}

// -------------------------------------------------------

void DialogSystemDetection::on_spinBoxWidthSquares_valueChanged(int i) {
    m_detection.setCurrentWidthSquares(i);
}

// -------------------------------------------------------

void DialogSystemDetection::on_spinBoxWidthPixels_valueChanged(int i) {
    m_detection.setCurrentWidthPixels(static_cast<double>(i) / RPM
        ::getSquareSize() * 100.0);
}

// -------------------------------------------------------

void DialogSystemDetection::on_spinBoxHeightSquares_valueChanged(int i) {
    m_detection.setCurrentHeightSquares(i);
}

// -------------------------------------------------------

void DialogSystemDetection::on_spinBoxHeightPixels_valueChanged(int i) {
    m_detection.setCurrentHeightPixels(static_cast<double>(i) / RPM
        ::getSquareSize() * 100.0);
}

// -------------------------------------------------------

void DialogSystemDetection::on_comboBoxAutomatic_currentIndexChanged(int index)
{
    ui->labelWidth->setVisible(index == 1);
    ui->spinBoxWidth->setVisible(index == 1);
    ui->labelRadiusLength->setText(index == 0 ? RPM::translate(Translations
        ::RADIUS) : RPM::translate(Translations::LENGTH));
    ui->spinBoxRadiusLength->setValue(index == 0 ? m_radius : m_length);
}

// -------------------------------------------------------

void DialogSystemDetection::on_spinBoxRadiusLength_valueChanged(int i) {
    if (ui->comboBoxAutomatic->currentIndex() == 0) {
        m_radius = i;
    } else {
        m_length = i;
    }
}

// -------------------------------------------------------

void DialogSystemDetection::on_pushButtonGenerate_pressed() {
    Position position;
    ui->widgetMapEditor->getMap()->cursor()->getPosition3D(position);
    if (ui->comboBoxAutomatic->currentIndex() == 0) {
        m_detection.generateCircle(ui->spinBoxRadiusLength->value(), position);
    } else {
        m_detection.generateRectangle(ui->spinBoxRadiusLength->value(), ui
            ->spinBoxWidth->value(), position);
    }
    this->updateMap();
}
