/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "systemstate.h"
#include "main.h"
#include "systemobjectevent.h"
#include "systemcommonreaction.h"
#include "dialogsystemstate.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemState::SystemState() :
    SystemState(SuperListItem::getById(RPM::get()->project()->gameDatas()
                                       ->commonEventsDatas()->modelStates()
                                       ->invisibleRootItem(), 1),
                MapEditorSubSelectionKind::None, -1, 0, 0, false, false, false,
                false, false, false, false, false)
{

}

SystemState::SystemState(SuperListItem *state, MapEditorSubSelectionKind gk,
                         int gid, int x, int y, bool m, bool s, bool cl, bool d,
                         bool t, bool c, bool p, bool k) :
    SuperListItem(state->id(), state->name()),
    m_state(state),
    m_graphicsKind(gk),
    m_graphicsId(gid),
    m_indexX(x),
    m_indexY(y),
    m_moveAnimation(m),
    m_stopAnimation(s),
    m_climbAnimation(cl),
    m_directionFix(d),
    m_through(t),
    m_setWithCamera(c),
    m_pixelOffset(p),
    m_keepPosition(k)
{

}

SystemState::~SystemState(){

}

QString SystemState::name() const { return m_state->name(); }

SuperListItem* SystemState::state() const { return m_state; }

void SystemState::setState(SuperListItem* s) {
    m_state = s;
    setId(m_state->id());
    setName(m_state->name());
}

MapEditorSubSelectionKind SystemState::graphicsKind() const {
    return m_graphicsKind;
}

void SystemState::setGraphicsKind(MapEditorSubSelectionKind k) {
    m_graphicsKind = k;
}

int SystemState::graphicsId() const { return m_graphicsId; }

void SystemState::setGraphicsId(int i) { m_graphicsId = i; }

int SystemState::indexX() const { return m_indexX; }

void SystemState::setIndexX(int i) { m_indexX = i; }

int SystemState::indexY() const { return m_indexY; }

void SystemState::setIndexY(int i) { m_indexY = i; }

QRect SystemState::rectTileset() const {
    return m_rectTileset;
}

void SystemState::setRectTileset(QRect rect) {
    m_rectTileset = rect;
}

bool SystemState::moveAnimation() const { return m_moveAnimation; }

bool SystemState::stopAnimation() const { return m_stopAnimation; }

bool SystemState::climbAnimation() const { return m_climbAnimation; }

bool SystemState::directionFix() const { return m_directionFix; }

bool SystemState::through() const { return m_through; }

bool SystemState::setWithCamera() const { return m_setWithCamera; }

bool SystemState::pixelOffset() const { return m_pixelOffset; }

bool SystemState::keepPosition() const { return m_keepPosition; }

void SystemState::setMoveAnimation(bool b) { m_moveAnimation = b; }

void SystemState::setStopAnimation(bool b) { m_stopAnimation = b; }

void SystemState::setClimbAnimation(bool b) { m_climbAnimation = b; }

void SystemState::setDirectionFix(bool b) { m_directionFix = b; }

void SystemState::setThrough(bool b) { m_through = b; }

void SystemState::setSetWithCamera(bool b) { m_setWithCamera = b; }

void SystemState::setPixelOffset(bool b) { m_pixelOffset = b; }

void SystemState::setKeepPosition(bool b) { m_keepPosition = b; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

bool SystemState::openDialog(){
    SystemState super;
    super.setCopy(*this);
    DialogSystemState dialog(super);
    if (dialog.exec() == QDialog::Accepted){
        setCopy(super);
        return true;
    }
    return false;
}

// -------------------------------------------------------

SuperListItem* SystemState::createCopy() const{
    SystemState* super = new SystemState;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemState::setCopy(const SystemState& state){
    SuperListItem::setCopy(state);
    p_id = state.p_id;

    m_state = state.m_state;
    m_graphicsId = state.m_graphicsId;
    m_graphicsKind = state.m_graphicsKind;
    m_indexX = state.m_indexX;
    m_indexY = state.m_indexY;
    m_rectTileset = state.m_rectTileset;
    m_moveAnimation = state.m_moveAnimation;
    m_stopAnimation = state.m_stopAnimation;
    m_climbAnimation = state.m_climbAnimation;
    m_directionFix = state.m_directionFix;
    m_through = state.m_through;
    m_setWithCamera = state.m_setWithCamera;
    m_pixelOffset = state.m_pixelOffset;
    m_keepPosition = state.m_keepPosition;
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemState::read(const QJsonObject &json){
    SuperListItem::read(json);
    QJsonArray tab;

    setState(SuperListItem::getById(RPM::get()->project()->gameDatas()
                                    ->commonEventsDatas()->modelStates()
                                    ->invisibleRootItem(), id()));
    m_graphicsKind = static_cast<MapEditorSubSelectionKind>(json["gk"].toInt());
    m_graphicsId = json["gid"].toInt();
    if (m_graphicsId == 0) {
        tab = json["rt"].toArray();
        m_rectTileset = QRect(tab[0].toInt(), tab[1].toInt(), tab[2].toInt(), tab[3]
            .toInt());
    } else {
        m_indexX = json["x"].toInt();
        m_indexY = json["y"].toInt();
    }
    m_moveAnimation = json["move"].toBool();
    m_stopAnimation = json["stop"].toBool();
    m_climbAnimation = json["climb"].toBool();
    m_directionFix = json["dir"].toBool();
    m_through = json["through"].toBool();
    m_setWithCamera = json["cam"].toBool();
    m_pixelOffset = json["pix"].toBool();
    m_keepPosition = json["pos"].toBool();
}

// -------------------------------------------------------

void SystemState::write(QJsonObject &json) const{
    SuperListItem::write(json);
    QJsonArray tab;

    json["gk"] = (int) m_graphicsKind;
    json["gid"] = m_graphicsId;
    if (m_graphicsId == 0) {
        tab.append(m_rectTileset.x());
        tab.append(m_rectTileset.y());
        tab.append(m_rectTileset.width());
        tab.append(m_rectTileset.height());
        json["rt"] = tab;
    } else {
        json["x"] = m_indexX;
        json["y"] = m_indexY;
    }
    json["move"] = m_moveAnimation;
    json["stop"] = m_stopAnimation;
    json["climb"] = m_climbAnimation;
    json["dir"] = m_directionFix;
    json["through"] = m_through;
    json["cam"] = m_setWithCamera;
    json["pix"] = m_pixelOffset;
    json["pos"] = m_keepPosition;
}
