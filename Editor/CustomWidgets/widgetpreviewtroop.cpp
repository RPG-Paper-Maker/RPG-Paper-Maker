/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "widgetpreviewtroop.h"
#include "map.h"
#include "rpm.h"
#include "systembattlemap.h"
#include "systemcameraproperties.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetPreviewTroop::WidgetPreviewTroop(QWidget *parent) :
    WidgetMapEditor(parent)
{
    m_control.setDisplayGrid(false);
    m_control.setDisplayCursor(false);
}

WidgetPreviewTroop::~WidgetPreviewTroop()
{
    this->clear();
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetPreviewTroop::clear()
{
    if (m_position != nullptr)
    {
        delete m_position;
    }
    if (m_positionObject)
    {
        delete m_positionObject;
    }
}

// -------------------------------------------------------

void WidgetPreviewTroop::initialize(SystemTroop *troop)
{
    SystemBattleMap *battleMap = reinterpret_cast<SystemBattleMap *>(SuperListItem
        ::getById(RPM::get()->project()->gameDatas()->battleSystemDatas()
        ->modelBattleMaps()->invisibleRootItem(), RPM::get()->engineSettings()
        ->battleTroopTestBattleMapID()));
    Map *map = new Map(battleMap->idMap());
    SystemCameraProperties *cameraProperties = reinterpret_cast<SystemCameraProperties *>(
        SuperListItem::getById(RPM::get()->project()->gameDatas()->systemDatas()
        ->modelcameraProperties()->invisibleRootItem(), map->mapProperties()
        ->cameraProperties()->numberValue()));
    this->clear();
    this->deleteMap();
    m_position = new QVector3D(battleMap->position().x() * RPM::getSquareSize(),
        battleMap->position().y() * RPM::getSquareSize(), battleMap->position()
        .z() * RPM::getSquareSize());
    m_positionObject = new QVector3D();
    this->needUpdateMap(battleMap->idMap(), m_position, m_positionObject,
        cameraProperties->distance()->numberDoubleValue(), cameraProperties
        ->horizontalAngle()->numberDoubleValue(), cameraProperties->verticalAngle()
        ->numberDoubleValue());
    delete map;
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void WidgetPreviewTroop::wheelEvent(QWheelEvent *)
{

}

// -------------------------------------------------------

void WidgetPreviewTroop::enterEvent(QEvent *)
{

}

// -------------------------------------------------------

void WidgetPreviewTroop::leaveEvent(QEvent *)
{

}

// -------------------------------------------------------

void WidgetPreviewTroop::mouseMoveEvent(QMouseEvent *)
{

}

// -------------------------------------------------------

void WidgetPreviewTroop::mousePressEvent(QMouseEvent *)
{

}

// -------------------------------------------------------

void WidgetPreviewTroop::mouseReleaseEvent(QMouseEvent *)
{

}

// -------------------------------------------------------

void WidgetPreviewTroop::mouseDoubleClickEvent(QMouseEvent *)
{

}

// -------------------------------------------------------

void WidgetPreviewTroop::keyPressEvent(QKeyEvent *)
{

}

// -------------------------------------------------------

void WidgetPreviewTroop::keyReleaseEvent(QKeyEvent *)
{

}
