/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemanimation.h"
#include "systemanimationframe.h"
#include "rpm.h"

const QString SystemAnimation::JSON_PICTURE_ID = "pid";
const QString SystemAnimation::JSON_POSITION_KIND = "pk";
const QString SystemAnimation::JSON_FRAMES = "f";
const QString SystemAnimation::JSON_ROWS = "r";
const QString SystemAnimation::JSON_COLUMNS = "c";
const int SystemAnimation::DEFAULT_PICTURE_ID = 1;
const AnimationPositionKind SystemAnimation::DEFAULT_POSITION_KIND =
    AnimationPositionKind::Middle;
const int SystemAnimation::DEFAULT_ROWS = 5;
const int SystemAnimation::DEFAULT_COLUMNS = 5;

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemAnimation::SystemAnimation() :
    SystemAnimation(1, "", DEFAULT_PICTURE_ID, DEFAULT_POSITION_KIND,
        DEFAULT_ROWS, DEFAULT_COLUMNS)
{

}

SystemAnimation::SystemAnimation(int i, QString n, int pid,
    AnimationPositionKind pk, int r, int c) :
    SuperListItem(i, n),
    m_pictureID(pid),
    m_positionKind(pk),
    m_framesModel(new QStandardItemModel),
    m_rows(r),
    m_columns(c)
{

}

SystemAnimation::~SystemAnimation() {
    SuperListItem::deleteModel(m_framesModel);
}

int SystemAnimation::pictureID() const {
    return m_pictureID;
}

void SystemAnimation::setPictureID(int pid) {
    m_pictureID = pid;
}

AnimationPositionKind SystemAnimation::positionKind() const {
    return m_positionKind;
}

void SystemAnimation::setPositionKind(AnimationPositionKind pk) {
    this->correctAllPositions(m_positionKind, pk);
    m_positionKind = pk;
}

QStandardItemModel * SystemAnimation::framesModel() const {
    return m_framesModel;
}

int SystemAnimation::rows() const {
    return m_rows;
}

void SystemAnimation::setRows(int r) {
    m_rows = r;
}

int SystemAnimation::columns() const {
    return m_columns;
}

void SystemAnimation::setColumns(int c) {
    m_columns = c;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

SystemPicture * SystemAnimation::picture() const {
    SystemPicture *picture;

    picture = reinterpret_cast<SystemPicture *>(SuperListItem::getById(RPM
        ::get()->project()->picturesDatas()->model(PictureKind::Animations)
        ->invisibleRootItem(), m_pictureID, false));
    if (picture == nullptr) {
        picture = RPM::get()->project()->picturesDatas()->missingPicture();
        picture->setId(m_pictureID);
    }

    return picture;
}

// -------------------------------------------------------

void SystemAnimation::correctAllPositions(AnimationPositionKind previous,
    AnimationPositionKind after)
{
    SystemAnimationFrame *frame;
    int i, j, l, ll;

    for (i = 0, l = m_framesModel->invisibleRootItem()->rowCount(); i < l; i++)
    {
        frame = reinterpret_cast<SystemAnimationFrame *>(m_framesModel->item(i)
            ->data().value<quintptr>());
        for (j = 0, ll = frame->elementsCount(); j < ll; j++) {
            frame->elementAt(j)->correctPosition(previous, after);
        }
    }
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void SystemAnimation::setDefault() {
    SystemAnimationFrame *frame;

    frame = new SystemAnimationFrame;
    frame->setDefault();
    m_framesModel->appendRow(frame->getModelRow());
}

// -------------------------------------------------------

SuperListItem* SystemAnimation::createCopy() const{
    SystemAnimation* super = new SystemAnimation;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemAnimation::setCopy(const SuperListItem &super) {
    const SystemAnimation *animation;

    animation = reinterpret_cast<const SystemAnimation *>(&super);
    m_pictureID = animation->pictureID();
    m_positionKind = animation->m_positionKind;
    SuperListItem::deleteModel(m_framesModel, false);
    SuperListItem::copyModel(m_framesModel, animation->m_framesModel);
    m_rows = animation->m_rows;
    m_columns = animation->m_columns;
}

// -------------------------------------------------------

void SystemAnimation::read(const QJsonObject &json) {
    SuperListItem::read(json);

    if (json.contains(JSON_PICTURE_ID)) {
        m_pictureID = json[JSON_PICTURE_ID].toInt();
    }
    if (json.contains(JSON_POSITION_KIND)) {
        m_positionKind = static_cast<AnimationPositionKind>(json[
            JSON_POSITION_KIND].toInt());
    }
    SuperListItem::readList(m_framesModel, new SystemAnimationFrame, json,
        JSON_FRAMES);
    if (json.contains(JSON_ROWS)) {
        m_rows = json[JSON_ROWS].toInt();
    }
    if (json.contains(JSON_COLUMNS)) {
        m_columns = json[JSON_COLUMNS].toInt();
    }
}

// -------------------------------------------------------

void SystemAnimation::write(QJsonObject &json) const {
    SuperListItem::write(json);

    if (m_pictureID != DEFAULT_PICTURE_ID) {
        json[JSON_PICTURE_ID] = m_pictureID;
    }
    if (m_positionKind != DEFAULT_POSITION_KIND) {
        json[JSON_POSITION_KIND] = static_cast<int>(m_positionKind);
    }
    SuperListItem::writeList(m_framesModel, json, JSON_FRAMES);
    if (m_rows != DEFAULT_ROWS) {
        json[JSON_ROWS] = m_rows;
    }
    if (m_columns != DEFAULT_COLUMNS) {
        json[JSON_COLUMNS] = m_columns;
    }
}
