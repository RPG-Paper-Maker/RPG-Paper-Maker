/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommandswitchtexture.h"
#include "ui_dialogcommandswitchtexture.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandSwitchTexture::DialogCommandSwitchTexture(EventCommand *command,
    QStandardItemModel *properties, QStandardItemModel *parameters, QWidget *parent) :
    DialogCommand(parent),
    ui(new Ui::DialogCommandSwitchTexture),
    m_properties(properties),
    m_parameters(parameters),
    m_valueTilesetID(new PrimitiveValue(-1)),
    m_valueAutotileID(new PrimitiveValue(-1)),
    m_valueWallID(new PrimitiveValue(-1)),
    m_value3DObjectID(new PrimitiveValue(-1)),
    m_valueMountainID(new PrimitiveValue(-1))
{
    ui->setupUi(this);
    this->initializePrimitives();
    if (command != nullptr)
    {
        this->initialize(command);
    }
    this->translate();
}

DialogCommandSwitchTexture::~DialogCommandSwitchTexture()
{
    delete ui;
    delete m_valueTilesetID;
    delete m_valueAutotileID;
    delete m_valueWallID;
    delete m_value3DObjectID;
    delete m_valueMountainID;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandSwitchTexture::initializePrimitives()
{
    ui->panelPrimitiveTilesetID->initializeDataBaseCommandId(RPM::get()->project()
        ->gameDatas()->tilesetsDatas()->model(), m_parameters, m_properties);
    ui->panelPrimitiveAutotileID->initializeDataBaseCommandId(RPM::get()->project()
        ->specialElementsDatas()->modelAutotiles(), m_parameters, m_properties);
    ui->panelPrimitiveWallID->initializeDataBaseCommandId(RPM::get()->project()
        ->specialElementsDatas()->modelSpriteWalls(), m_parameters, m_properties);
    ui->panelPrimitive3DObjectID->initializeDataBaseCommandId(RPM::get()->project()
        ->specialElementsDatas()->modelObjects3D(), m_parameters, m_properties);
    ui->panelPrimitiveMountainID->initializeDataBaseCommandId(RPM::get()->project()
        ->specialElementsDatas()->modelMountains(), m_parameters, m_properties);
    ui->widgetPictureTileset->setKind(PictureKind::Tilesets);
    ui->widgetPictureTileset->initializePrimitive(m_valueTilesetID, m_properties, m_parameters);
    ui->widgetPictureAutotile->setKind(PictureKind::Autotiles);
    ui->widgetPictureAutotile->initializePrimitive(m_valueAutotileID, m_properties, m_parameters);
    ui->widgetPictureWall->setKind(PictureKind::Walls);
    ui->widgetPictureWall->initializePrimitive(m_valueWallID, m_properties, m_parameters);
    ui->widgetPicture3DObject->setKind(PictureKind::Object3D);
    ui->widgetPicture3DObject->initializePrimitive(m_value3DObjectID, m_properties, m_parameters);
    ui->widgetPictureMountain->setKind(PictureKind::Mountains);
    ui->widgetPictureMountain->initializePrimitive(m_valueMountainID, m_properties, m_parameters);
}

// -------------------------------------------------------

void DialogCommandSwitchTexture::translate()
{
    this->setWindowTitle(RPM::translate(Translations::SWITCH_TEXTURE) + RPM
        ::DOT_DOT_DOT);
    ui->checkBoxTilesetID->setText(RPM::translate(Translations::TILESET_ID) + RPM::COLON);
    ui->checkBoxAutotileID->setText(RPM::translate(Translations::AUTOTILE_ID) + RPM::COLON);
    ui->checkBoxWallID->setText(RPM::translate(Translations::WALL_ID) + RPM::COLON);
    ui->checkBox3DObjectID->setText(RPM::translate(Translations::OBJECT_3D_ID) + RPM::COLON);
    ui->checkBoxMountainID->setText(RPM::translate(Translations::MOUNTAIN_ID) + RPM::COLON);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

EventCommand * DialogCommandSwitchTexture::getCommand() const
{
    QVector<QString> command;
    command.append(RPM::boolToString(ui->checkBoxTilesetID->isChecked()));
    if (ui->checkBoxTilesetID->isChecked())
    {
        ui->panelPrimitiveTilesetID->getCommand(command);
        m_valueTilesetID->getCommandParameter(command, true);
    }
    command.append(RPM::boolToString(ui->checkBoxAutotileID->isChecked()));
    if (ui->checkBoxAutotileID->isChecked())
    {
        ui->panelPrimitiveAutotileID->getCommand(command);
        m_valueAutotileID->getCommandParameter(command, true);
    }
    command.append(RPM::boolToString(ui->checkBoxWallID->isChecked()));
    if (ui->checkBoxWallID->isChecked())
    {
        ui->panelPrimitiveWallID->getCommand(command);
        m_valueWallID->getCommandParameter(command, true);
    }
    command.append(RPM::boolToString(ui->checkBox3DObjectID->isChecked()));
    if (ui->checkBox3DObjectID->isChecked())
    {
        ui->panelPrimitive3DObjectID->getCommand(command);
        m_value3DObjectID->getCommandParameter(command, true);
    }
    command.append(RPM::boolToString(ui->checkBoxMountainID->isChecked()));
    if (ui->checkBoxMountainID->isChecked())
    {
        ui->panelPrimitiveMountainID->getCommand(command);
        m_valueMountainID->getCommandParameter(command, true);
    }
    return new EventCommand(EventCommandKind::SwitchTextures, command);
}

// -------------------------------------------------------

void DialogCommandSwitchTexture::initialize(EventCommand *command)
{
    int i = 0;
    ui->checkBoxTilesetID->setChecked(RPM::stringToBool(command->valueCommandAt(i++)));
    if (ui->checkBoxTilesetID->isChecked())
    {
        ui->panelPrimitiveTilesetID->initializeCommand(command, i);
        m_valueTilesetID->initializeCommandParameter(command, i, true);
        ui->widgetPictureTileset->initializePrimitive(m_valueTilesetID, m_properties, m_parameters);
    }
    ui->checkBoxAutotileID->setChecked(RPM::stringToBool(command->valueCommandAt(i++)));
    if (ui->checkBoxAutotileID->isChecked())
    {
        ui->panelPrimitiveAutotileID->initializeCommand(command, i);
        m_valueAutotileID->initializeCommandParameter(command, i, true);
        ui->widgetPictureAutotile->initializePrimitive(m_valueAutotileID, m_properties, m_parameters);
    }
    ui->checkBoxWallID->setChecked(RPM::stringToBool(command->valueCommandAt(i++)));
    if (ui->checkBoxWallID->isChecked())
    {
        ui->panelPrimitiveWallID->initializeCommand(command, i);
        m_valueWallID->initializeCommandParameter(command, i, true);
        ui->widgetPictureWall->initializePrimitive(m_valueWallID, m_properties, m_parameters);
    }
    ui->checkBox3DObjectID->setChecked(RPM::stringToBool(command->valueCommandAt(i++)));
    if (ui->checkBox3DObjectID->isChecked())
    {
        ui->panelPrimitive3DObjectID->initializeCommand(command, i);
        m_value3DObjectID->initializeCommandParameter(command, i, true);
        ui->widgetPicture3DObject->initializePrimitive(m_value3DObjectID, m_properties, m_parameters);
    }
    ui->checkBoxMountainID->setChecked(RPM::stringToBool(command->valueCommandAt(i++)));
    if (ui->checkBoxMountainID->isChecked())
    {
        ui->panelPrimitiveMountainID->initializeCommand(command, i);
        m_valueMountainID->initializeCommandParameter(command, i, true);
        ui->widgetPictureMountain->initializePrimitive(m_valueMountainID, m_properties, m_parameters);
    }
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogCommandSwitchTexture::on_checkBoxTilesetID_toggled(bool checked)
{
    ui->panelPrimitiveTilesetID->setEnabled(checked);
    ui->widgetPictureTileset->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandSwitchTexture::on_checkBoxAutotileID_toggled(bool checked)
{
    ui->panelPrimitiveAutotileID->setEnabled(checked);
    ui->widgetPictureAutotile->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandSwitchTexture::on_checkBoxWallID_toggled(bool checked)
{
    ui->panelPrimitiveWallID->setEnabled(checked);
    ui->widgetPictureWall->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandSwitchTexture::on_checkBox3DObjectID_toggled(bool checked)
{
    ui->panelPrimitive3DObjectID->setEnabled(checked);
    ui->widgetPicture3DObject->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandSwitchTexture::on_checkBoxMountainID_toggled(bool checked)
{
    ui->panelPrimitiveMountainID->setEnabled(checked);
    ui->widgetPictureMountain->setEnabled(checked);
}
