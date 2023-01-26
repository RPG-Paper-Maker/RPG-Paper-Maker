/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemanimationframeelement.h"
#include "dialogsystemanimationframeelement.h"
#include "rpm.h"

const QString SystemAnimationFrameElement::JSON_X = "x";
const QString SystemAnimationFrameElement::JSON_Y = "y";
const QString SystemAnimationFrameElement::JSON_TEX_ROW = "tr";
const QString SystemAnimationFrameElement::JSON_TEX_COLUMN = "tc";
const QString SystemAnimationFrameElement::JSON_ZOOM = "z";
const QString SystemAnimationFrameElement::JSON_ANGLE = "a";
const QString SystemAnimationFrameElement::JSON_FLIP_VERTICALY = "fv";
const QString SystemAnimationFrameElement::JSON_OPACITY = "o";
const int SystemAnimationFrameElement::DEFAULT_X = 0;
const int SystemAnimationFrameElement::DEFAULT_Y = 0;
const int SystemAnimationFrameElement::DEFAULT_TEX_ROW = 0;
const int SystemAnimationFrameElement::DEFAULT_TEX_COLUMN = 0;
const double SystemAnimationFrameElement::DEFAULT_ZOOM = 100.0;
const double SystemAnimationFrameElement::DEFAULT_ANGLE = 0.0;
const bool SystemAnimationFrameElement::DEFAULT_FLIP_VERTICALY = false;
const double SystemAnimationFrameElement::DEFAULT_OPACITY = 100.0;

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemAnimationFrameElement::SystemAnimationFrameElement() :
    SystemAnimationFrameElement(1, "")
{

}

SystemAnimationFrameElement::SystemAnimationFrameElement(int i, QString n, int x
    , int y, int tr, int tc, double z, double a, bool fv, double o) :
    SuperListItem(i, n),
    m_x(x),
    m_y(y),
    m_texRow(tr),
    m_texColumn(tc),
    m_zoom(z),
    m_angle(a),
    m_flipVerticaly(fv),
    m_opacity(o)
{

}

SystemAnimationFrameElement::~SystemAnimationFrameElement() {

}

int SystemAnimationFrameElement::x() const {
    return m_x;
}

void SystemAnimationFrameElement::setX(int x) {
    m_x = x;
}

int SystemAnimationFrameElement::y() const {
    return m_y;
}

void SystemAnimationFrameElement::setY(int y) {
    m_y = y;
}

int SystemAnimationFrameElement::texRow() const {
    return m_texRow;
}

void SystemAnimationFrameElement::setTexRow(int tr) {
    m_texRow = tr;
}

int SystemAnimationFrameElement::texColumn() const {
    return m_texColumn;
}

void SystemAnimationFrameElement::setTexColumn(int tc) {
    m_texColumn = tc;
}

double SystemAnimationFrameElement::zoom() const {
    return m_zoom;
}

void SystemAnimationFrameElement::setZoom(double z) {
    m_zoom = z;
}

double SystemAnimationFrameElement::angle() const {
    return m_angle;
}

void SystemAnimationFrameElement::setAngle(double a) {
    m_angle = a;
}

bool SystemAnimationFrameElement::flipVerticaly() const {
    return m_flipVerticaly;
}

void SystemAnimationFrameElement::setFlipVerticaly(bool fv) {
    m_flipVerticaly = fv;
}

double SystemAnimationFrameElement::opacity() const {
    return m_opacity;
}

void SystemAnimationFrameElement::setOpacity(double o) {
    m_opacity = o;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

QString SystemAnimationFrameElement::getPositionString() const {
    return "[" + QString::number(m_x) + "," + QString::number(m_y) + "]";
}

// -------------------------------------------------------

void SystemAnimationFrameElement::correctPosition(AnimationPositionKind previous
    , AnimationPositionKind after)
{
    if (previous == AnimationPositionKind::ScreenCenter && after !=
        AnimationPositionKind::ScreenCenter)
    {
        m_x -= RPM::SCREEN_BASIC_WIDTH / 2;
        m_y -= RPM::SCREEN_BASIC_HEIGHT / 2;
    } else if (after == AnimationPositionKind::ScreenCenter && previous !=
        AnimationPositionKind::ScreenCenter)
    {
        m_x += RPM::SCREEN_BASIC_WIDTH / 2;
        m_y += RPM::SCREEN_BASIC_HEIGHT / 2;
    }
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

bool SystemAnimationFrameElement::openDialog() {
    SystemAnimationFrameElement element;

    element.setCopy(*this);
    DialogSystemAnimationFrameElement dialog(element);
    if (dialog.exec() == QDialog::Accepted) {
        this->setCopy(element);
        return true;
    }
    return false;
}

// -------------------------------------------------------

SuperListItem * SystemAnimationFrameElement::createCopy() const {
    SystemAnimationFrameElement *super = new SystemAnimationFrameElement;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemAnimationFrameElement::setCopy(const SuperListItem &super) {
    const SystemAnimationFrameElement *sys;

    sys = reinterpret_cast<const SystemAnimationFrameElement *>(&super);
    p_id = sys->p_id;
    m_x = sys->m_x;
    m_y = sys->m_y;
    m_texRow = sys->m_texRow;
    m_texColumn = sys->m_texColumn;
    m_zoom = sys->m_zoom;
    m_angle = sys->m_angle;
    m_flipVerticaly = sys->m_flipVerticaly;
    m_opacity = sys->m_opacity;
}

// -------------------------------------------------------

void SystemAnimationFrameElement::read(const QJsonObject &json) {
    SuperListItem::read(json);

    if (json.contains(JSON_X)) {
        m_x = json[JSON_X].toInt();
    }
    if (json.contains(JSON_Y)) {
        m_y = json[JSON_Y].toInt();
    }
    if (json.contains(JSON_TEX_ROW)) {
        m_texRow = json[JSON_TEX_ROW].toInt();
    }
    if (json.contains(JSON_TEX_COLUMN)) {
        m_texColumn = json[JSON_TEX_COLUMN].toInt();
    }
    if (json.contains(JSON_ZOOM)) {
        m_zoom = json[JSON_ZOOM].toDouble();
    }
    if (json.contains(JSON_ANGLE)) {
        m_angle = json[JSON_ANGLE].toDouble();
    }
    if (json.contains(JSON_FLIP_VERTICALY)) {
        m_flipVerticaly = json[JSON_FLIP_VERTICALY].toBool();
    }
    if (json.contains(JSON_OPACITY)) {
        m_opacity = json[JSON_OPACITY].toDouble();
    }
}

// -------------------------------------------------------

void SystemAnimationFrameElement::write(QJsonObject &json) const {
    SuperListItem::write(json);

    if (m_x != DEFAULT_X) {
        json[JSON_X] = m_x;
    }
    if (m_y != DEFAULT_Y) {
        json[JSON_Y] = m_y;
    }
    if (m_texRow != DEFAULT_TEX_ROW) {
        json[JSON_TEX_ROW] = m_texRow;
    }
    if (m_texColumn != DEFAULT_TEX_COLUMN) {
        json[JSON_TEX_COLUMN] = m_texColumn;
    }
    if (!qFuzzyCompare(m_zoom, DEFAULT_ZOOM)) {
        json[JSON_ZOOM] = m_zoom;
    }
    if (!qFuzzyCompare(m_angle, DEFAULT_ANGLE)) {
        json[JSON_ANGLE] = m_angle;
    }
    if (m_flipVerticaly != DEFAULT_FLIP_VERTICALY) {
        json[JSON_FLIP_VERTICALY] = m_flipVerticaly;
    }
    if (!qFuzzyCompare(m_opacity, DEFAULT_OPACITY)) {
        json[JSON_OPACITY] = m_opacity;
    }
}
