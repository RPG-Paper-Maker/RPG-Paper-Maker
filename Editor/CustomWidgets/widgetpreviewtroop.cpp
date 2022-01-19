/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

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
#include "systemherotroopbattletest.h"
#include "systemhero.h"
#include "systemmonstertroop.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetPreviewTroop::WidgetPreviewTroop(QWidget *parent) :
    WidgetMapEditor(parent),
    m_troop(nullptr)
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
    this->makeCurrent();
    for (int i = 0, l = m_battlers.size(); i < l; i++)
    {
        delete m_battlers.at(i);
    }
    m_battlers.clear();
}

// -------------------------------------------------------

void WidgetPreviewTroop::initializeTree(WidgetSuperTree *tree)
{
    connect(tree, SIGNAL(modelUpdated()), this, SLOT(onTreeUpdated()));
}

// -------------------------------------------------------

void WidgetPreviewTroop::initialize(SystemTroop *troop)
{
    m_troop = troop;
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
    m_position = new QVector3D(battleMap->position().x() * RPM::getSquareSize() + (RPM::getSquareSize() / 2),
        battleMap->position().y() * RPM::getSquareSize() + battleMap->position()
        .yPlus(), battleMap->position().z() * RPM::getSquareSize() + (RPM::getSquareSize() / 2));
    m_positionObject = new QVector3D();
    this->needUpdateMap(battleMap->idMap(), m_position, m_positionObject,
        cameraProperties->distance()->numberDoubleValue(), cameraProperties
        ->horizontalAngle()->numberDoubleValue(), cameraProperties->verticalAngle()
        ->numberDoubleValue());
    delete map;
}

// -------------------------------------------------------

void WidgetPreviewTroop::getVectorExpression(QVector3D &vec, QString expression, int i)
{
    QScriptContext *local;
    local = m_engine.pushContext();
    local->activationObject().setProperty("$$SQUARE_SIZE", RPM::getSquareSize());
    local->activationObject().setProperty("i", i);
    QString expr = expression.replace("new Core.Vector3(", "");
    expr = expr.remove(expr.size() - 1, 1);
    expr = expr.replace("Datas.Systems.SQUARE_SIZE", "$$SQUARE_SIZE");
    QStringList list = expr.split(",");
    vec.setX(list.size() > 0 ? m_engine.evaluate(list.at(0)).toNumber() : 0);
    vec.setY(list.size() > 1 ? m_engine.evaluate(list.at(1)).toNumber() : 0);
    vec.setZ(list.size() > 2 ? m_engine.evaluate(list.at(2)).toNumber() : 0);
    m_engine.popContext();
}

// -------------------------------------------------------

void WidgetPreviewTroop::reload()
{
    this->initialize(m_troop);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void WidgetPreviewTroop::onTreeUpdated()
{
    this->reload();
}

// -------------------------------------------------------

void WidgetPreviewTroop::paintOther3DStuff()
{
    m_control.map()->programFaceSprite()->bind();
    for (int i = 0, l = m_battlers.size(); i < l; i++)
    {
        m_battlers.at(i)->paintGL();
    }
    m_control.map()->programFaceSprite()->release();
}

// -------------------------------------------------------

void WidgetPreviewTroop::paintOtherHUDStuff(QPainter &p)
{
    p.setRenderHint(QPainter::Antialiasing);
    QPen pen(RPM::COLOR_ALMOST_WHITE_SEMI_TRANSPARENT, 2);
    p.setPen(pen);
    p.drawLine(0, RPM::SCREEN_BASIC_HEIGHT / 2, RPM::SCREEN_BASIC_WIDTH, RPM
        ::SCREEN_BASIC_HEIGHT / 2);
    p.drawLine(RPM::SCREEN_BASIC_WIDTH / 2, 0, RPM::SCREEN_BASIC_WIDTH / 2, RPM
        ::SCREEN_BASIC_HEIGHT);
}

// -------------------------------------------------------

Map * WidgetPreviewTroop::loadMap(int idMap, QVector3D *position, QVector3D
    *positionObject, int cameraDistance, double cameraHorizontalAngle, double
    cameraVerticalAngle)
{
    Map *map = WidgetMapEditor::loadMap(idMap, position, positionObject,
        cameraDistance, cameraHorizontalAngle, cameraVerticalAngle);

    // Add heroes battlers
    QJsonArray heroes = RPM::get()->engineSettings()->battleTroopTestHeroes();
    QJsonObject obj;
    if (heroes.isEmpty())
    {
        obj[SystemHeroTroopBattleTest::JSON_HERO_ID] = 1;
        heroes.append(obj);
    }
    int heroID;
    SystemHero *hero;
    Battler *battler;
    for (int i = 0, l = heroes.size(); i < l; i++)
    {
        obj = heroes.at(i).toObject();
        heroID = obj.contains(SystemHeroTroopBattleTest::JSON_HERO_ID) ? obj[
            SystemHeroTroopBattleTest::JSON_HERO_ID].toInt() : 1;
        hero = reinterpret_cast<SystemHero *>(SuperListItem::getById(RPM::get()
            ->project()->gameDatas()->heroesDatas()->model()->invisibleRootItem(),
            heroID, true));
        QVector3D center;
        this->getVectorExpression(center, RPM::get()->project()->gameDatas()
            ->battleSystemDatas()->heroesBattlersCenterOffset()->messageValue());
        QVector3D offset;
        this->getVectorExpression(offset, RPM::get()->project()->gameDatas()
            ->battleSystemDatas()->heroesBattlersOffset()->messageValue(), i);
        QVector3D p = *m_position + center + offset;
        battler = new Battler(p, hero->idBattlerPicture());
        battler->initializeGL(map->programFaceSprite());
        battler->initializeVertices();
        battler->updateGL();
        m_battlers.append(battler);
    }

    // Add enemies battlers
    SystemMonsterTroop *monster;
    for (int i = 0, l = m_troop->monstersList()->invisibleRootItem()->rowCount();
        i < l; i++)
    {
        monster = reinterpret_cast<SystemMonsterTroop *>(SuperListItem
            ::getItemModelAt(m_troop->monstersList(), i));
        if (monster != nullptr)
        {
            hero = reinterpret_cast<SystemHero *>(SuperListItem::getById(RPM::get()
                ->project()->gameDatas()->monstersDatas()->model()->invisibleRootItem(),
                monster->id(), true));
            QVector3D center, offset;
            if (monster->isSpecificPosition())
            {
                this->getVectorExpression(center, monster->specificPosition()
                    ->messageValue());
            } else {
                this->getVectorExpression(center, RPM::get()->project()->gameDatas()
                    ->battleSystemDatas()->troopsBattlersCenterOffset()->messageValue());
                this->getVectorExpression(offset, RPM::get()->project()->gameDatas()
                    ->battleSystemDatas()->troopsBattlersOffset()->messageValue(), i);
            }
            QVector3D p = *m_position + center + offset;
            battler = new Battler(p, hero->idBattlerPicture(), true);
            battler->initializeGL(map->programFaceSprite());
            battler->initializeVertices();
            battler->updateGL();
            m_battlers.append(battler);
        }
    }

    return map;
}

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
