/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

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
    m_parameters(parameters)
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
    ui->widgetPictureTileset->initialize();
    ui->widgetPictureAutotile->setKind(PictureKind::Autotiles);
    ui->widgetPictureAutotile->initialize();
    ui->widgetPictureWall->setKind(PictureKind::Walls);
    ui->widgetPictureWall->initialize();
    ui->widgetPicture3DObject->setKind(PictureKind::Object3D);
    ui->widgetPicture3DObject->initialize();
    ui->widgetPictureMountain->setKind(PictureKind::Mountains);
    ui->widgetPictureMountain->initialize();
}

// -------------------------------------------------------

void DialogCommandSwitchTexture::translate()
{
    this->setWindowTitle(RPM::translate(Translations::PLAY_A_VIDEO) + RPM
        ::DOT_DOT_DOT);
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

    return new EventCommand(EventCommandKind::SwitchTextures, command);
}

// -------------------------------------------------------

void DialogCommandSwitchTexture::initialize(EventCommand *command)
{
    int i = 0;

}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------
