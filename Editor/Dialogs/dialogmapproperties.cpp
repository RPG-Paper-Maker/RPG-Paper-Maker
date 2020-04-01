/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogmapproperties.h"
#include "ui_dialogmapproperties.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogMapProperties::DialogMapProperties(MapProperties &properties,
                                         QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogMapProperties),
    m_mapProperties(properties)
{
    ui->setupUi(this);

    initialize();

    this->translate();
}

DialogMapProperties::~DialogMapProperties()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogMapProperties::initialize() {

    // Tileset
    SuperListItem::fillComboBox(ui->comboBoxTileset, RPM::get()->project()
        ->gameDatas()->tilesetsDatas()->model());
    connect(ui->comboBoxTileset, SIGNAL(currentIndexChanged(int)), this,
        SLOT(on_comboBoxTilesetCurrentIndexChanged(int)));
    ui->comboBoxTileset->setCurrentIndex(SuperListItem::getIndexById(
        RPM::get()->project()->gameDatas()->tilesetsDatas()->model()
        ->invisibleRootItem(), m_mapProperties.tileset()->id()));

    ui->widgetLangName->initializeNamesLang(&m_mapProperties);

    // Music
    ui->widgetChooseMusic->initialize(m_mapProperties.music());

    // Background sound
    ui->widgetChooseBackgroundSound->initialize(m_mapProperties.backgroundSound());

    // Camera properties
    ui->panelPrimitiveCameraProperties->initializeDataBaseAndUpdate(
        m_mapProperties.cameraProperties());

    // Sizes
    ui->spinBoxLength->setValue(m_mapProperties.length());
    ui->spinBoxWidth->setValue(m_mapProperties.width());
    ui->spinBoxHeight->setValue(m_mapProperties.height());
    ui->spinBoxDepth->setValue(m_mapProperties.depth());

    // Sky
    if (m_mapProperties.isSkyColor())
    {
        ui->radioButtonColor->setChecked(true);
    } else {
        if (m_mapProperties.isSkyImage())
        {
            ui->radioButtonPicture->setChecked(true);
        } else
        {
            ui->radioButtonSkybox->setChecked(true);
        }
    }
    ui->panelPrimitiveValueSkyColor->initializeDataBaseAndUpdate(m_mapProperties
        .skyColorID());
    ui->widgetPictureSky->setKind(PictureKind::Pictures);
    ui->widgetPictureSky->initializeSuper(m_mapProperties.skyPictureID());
    ui->panelPrimitiveValueSkyBoxID->initializeDataBaseAndUpdate(m_mapProperties
        .skyboxID());

    ui->widgetConstantVariableSteps->initializeNumberVariable();
    ui->widgetConstantVariableStepsVariation->initializeNumberVariable();

    // Invisible object
    ui->panelObject->initializeList(RPM::get()->project()->gameDatas()
        ->commonEventsDatas()->modelCommonObjects());
    ui->panelObject->initializeModel(m_mapProperties.startupObject());
    ui->panelObject->updateModel();
    ui->panelObject->showInvisible(true);
}

// -------------------------------------------------------

void DialogMapProperties::translate() {
    this->setWindowTitle(RPM::translate(Translations::MAP_PROPERTIES) + RPM
        ::DOT_DOT_DOT);
    ui->tabWidget->setTabText(0, RPM::translate(Translations
        ::MAP_STARTUP_REACTIONS));
    ui->tabWidget->setTabText(1, RPM::translate(Translations::BATTLES));
    ui->labelName->setText(RPM::translate(Translations::NAME) + RPM::COLON);
    ui->labelDepth->setText(RPM::translate(Translations::DEPTH) + RPM::COLON);
    ui->labelMusic->setText(RPM::translate(Translations::MUSIC) + RPM::COLON);
    ui->labelWidth->setText(RPM::translate(Translations::WIDTH) + RPM::COLON);
    ui->labelLength->setText(RPM::translate(Translations::LENGTH) + RPM::COLON);
    ui->labelheight->setText(RPM::translate(Translations::HEIGHT) + RPM::COLON);
    ui->labelTileset->setText(RPM::translate(Translations::TILESET) + RPM::COLON);
    ui->labelCameraPropID->setText(RPM::translate(Translations
        ::CAMERA_PROPERTIES_ID) + RPM::COLON);
    ui->labelBackgroundSound->setText(RPM::translate(Translations
        ::BACKGROUND_SOUND) + RPM::COLON);
    ui->radioButtonColor->setText(RPM::translate(Translations::COLOR_ID) + RPM
        ::COLON);
    ui->radioButtonSkybox->setText(RPM::translate(Translations::PICTURE) + RPM
        ::COLON);
    ui->radioButtonSkybox->setText(RPM::translate(Translations::SKYBOX_ID) + RPM
        ::COLON);
    ui->groupBoxSky->setTitle(RPM::translate(Translations::SKY));
    ui->groupBoxSizes->setTitle(RPM::translate(Translations::SIZE));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogMapProperties::on_spinBoxLength_valueChanged(int i){
    m_mapProperties.setLength(i);
}

// -------------------------------------------------------

void DialogMapProperties::on_spinBoxWidth_valueChanged(int i){
    m_mapProperties.setWidth(i);
}

// -------------------------------------------------------

void DialogMapProperties::on_spinBoxHeight_valueChanged(int i){
    m_mapProperties.setHeight(i);
}

// -------------------------------------------------------

void DialogMapProperties::on_spinBoxDepth_valueChanged(int i){
    m_mapProperties.setDepth(i);
}

// -------------------------------------------------------

void DialogMapProperties::on_comboBoxTilesetCurrentIndexChanged(int index){
    m_mapProperties.setTilesetID(reinterpret_cast<SystemTileset*>(RPM::get()
        ->project()->gameDatas()->tilesetsDatas()->model()->item(index)->data()
        .value<qintptr>())->id());
}

// -------------------------------------------------------

void DialogMapProperties::on_radioButtonColor_toggled(bool checked)
{
    m_mapProperties.setIsSkyColor(checked);
    ui->panelPrimitiveValueSkyColor->setEnabled(checked);
}

// -------------------------------------------------------

void DialogMapProperties::on_radioButtonPicture_toggled(bool checked)
{
    m_mapProperties.setIsSkyImage(checked);
    ui->widgetPictureSky->setEnabled(checked);
}

// -------------------------------------------------------

void DialogMapProperties::on_radioButtonSkybox_toggled(bool checked)
{
    m_mapProperties.setIsSkyColor(ui->radioButtonColor->isChecked());
    m_mapProperties.setIsSkyImage(ui->radioButtonPicture->isChecked());
    ui->panelPrimitiveValueSkyBoxID->setEnabled(checked);
}
