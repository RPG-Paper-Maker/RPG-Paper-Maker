/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystemwindowskin.h"
#include "rpm.h"
#include "common.h"

const QString SystemWindowSkin::JSON_PICTURE_ID = "pid";
const QString SystemWindowSkin::JSON_TOP_LEFT = "tl";
const QString SystemWindowSkin::JSON_TOP_RIGHT = "tr";
const QString SystemWindowSkin::JSON_BOT_LEFT = "bl";
const QString SystemWindowSkin::JSON_BOT_RIGHT = "br";
const QString SystemWindowSkin::JSON_LEFT = "l";
const QString SystemWindowSkin::JSON_RIGHT = "r";
const QString SystemWindowSkin::JSON_TOP = "t";
const QString SystemWindowSkin::JSON_BOT = "b";
const QString SystemWindowSkin::JSON_BACKGROUND = "back";
const QString SystemWindowSkin::JSON_BACKGROUND_SELECTION = "backs";
const QString SystemWindowSkin::JSON_BACKGROUND_REPEAT = "backr";
const QString SystemWindowSkin::JSON_ARROW_END_MESSAGE = "aem";
const QString SystemWindowSkin::JSON_ARROW_TARGET_SELECTION = "ats";
const QString SystemWindowSkin::JSON_ARROW_UP_DOWN = "aud";
const QString SystemWindowSkin::JSON_TEXT_NORMAL = "tn";
const QString SystemWindowSkin::JSON_TEXT_CRITICAL = "tc";
const QString SystemWindowSkin::JSON_TEXT_HEAL = "th";
const QString SystemWindowSkin::JSON_TEXT_MISS = "tm";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------


SystemWindowSkin::SystemWindowSkin() :
    SystemWindowSkin(-1, "", -1, QRect(0, 0, 1, 1), QRect(0, 0, 1, 1), QRect(0,
    0, 1, 1), QRect(0, 0, 1, 1), QRect(0, 0, 1, 1), QRect(0, 0, 1, 1), QRect(0,
    0, 1, 1), QRect(0, 0, 1, 1), QRect(0, 0, 1, 1), QRect(0, 0, 1, 1), true,
    QRect(0, 0, 1, 1), QRect(0, 0, 1, 1), QRect(0, 0, 1, 1), QRect(0, 0, 1, 1),
    QRect(0, 0, 1, 1), QRect(0, 0, 1, 1), QRect(0, 0, 1, 1))
{

}

SystemWindowSkin::SystemWindowSkin(int i, QString n, int pictureID, QRectF
    topLeft, QRectF topRight, QRectF botLeft, QRectF botRight, QRectF left,
    QRectF right, QRectF top, QRectF bot, QRectF background, QRectF
    backgroundSelection, bool backgroundRepeat, QRectF arrowEndMessage, QRectF
    arrowTargetSelection, QRectF arrowUpDown, QRectF textNormal, QRectF textHeal
    , QRectF textCritical, QRectF textMiss) :
    SuperListItem (i, n),
    m_pictureID(pictureID),
    m_topLeft(topLeft),
    m_topRight(topRight),
    m_botLeft(botLeft),
    m_botRight(botRight),
    m_left(left),
    m_right(right),
    m_top(top),
    m_bot(bot),
    m_background(background),
    m_backgroundSelection(backgroundSelection),
    m_backgroudRepeat(backgroundRepeat),
    m_arrowEndMessage(arrowEndMessage),
    m_arrowTargetSelection(arrowTargetSelection),
    m_arrowUpDown(arrowUpDown),
    m_textNormal(textNormal),
    m_textCritical(textCritical),
    m_textHeal(textHeal),
    m_textMiss(textMiss)
{

}

SystemWindowSkin::~SystemWindowSkin()
{

}

int SystemWindowSkin::pictureID() const {
    return m_pictureID;
}

void SystemWindowSkin::setPictureID(int id) {
    m_pictureID = id;
}

QRectF * SystemWindowSkin::topLeft() {
    return &m_topLeft;
}

QRectF * SystemWindowSkin::topRight() {
    return &m_topRight;
}

QRectF * SystemWindowSkin::botLeft() {
    return &m_botLeft;
}

QRectF * SystemWindowSkin::botRight() {
    return &m_botRight;
}

QRectF * SystemWindowSkin::left() {
    return &m_left;
}

QRectF * SystemWindowSkin::right() {
    return &m_right;
}

QRectF * SystemWindowSkin::top() {
    return &m_top;
}

QRectF * SystemWindowSkin::bot() {
    return &m_bot;
}

QRectF * SystemWindowSkin::background() {
    return &m_background;
}

QRectF * SystemWindowSkin::backgroundSelection() {
    return &m_backgroundSelection;
}

bool SystemWindowSkin::backgroudRepeat() {
    return m_backgroudRepeat;
}

void SystemWindowSkin::setBackgroundRepeat(bool b) {
    m_backgroudRepeat = b;
}

QRectF * SystemWindowSkin::arrowEndMessage() {
    return &m_arrowEndMessage;
}

QRectF * SystemWindowSkin::arrowTargetSelection() {
    return &m_arrowTargetSelection;
}

QRectF * SystemWindowSkin::arrowUpDown() {
    return &m_arrowUpDown;
}

QRectF * SystemWindowSkin::textNormal() {
    return &m_textNormal;
}

QRectF * SystemWindowSkin::textCritical() {
    return &m_textCritical;
}

QRectF * SystemWindowSkin::textHeal() {
    return &m_textHeal;
}

QRectF * SystemWindowSkin::textMiss() {
    return &m_textMiss;
}

// -------------------------------------------------------
//
//  VIRTUAL
//
// -------------------------------------------------------

bool SystemWindowSkin::openDialog() {
    SystemWindowSkin windowSkin;
    windowSkin.setCopy(*this);
    DialogSystemWindowSkin dialog(windowSkin);
    if (dialog.exec() == QDialog::Accepted){
        setCopy(windowSkin);
        return true;
    }
    return false;
}

// -------------------------------------------------------

SuperListItem* SystemWindowSkin::createCopy() const {
    SystemWindowSkin* super = new SystemWindowSkin;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemWindowSkin::setCopy(const SystemWindowSkin& super) {
    SuperListItem::setCopy(super);

    m_pictureID = super.m_pictureID;
    m_topLeft = super.m_topLeft;
    m_topRight = super.m_topRight;
    m_botLeft = super.m_botLeft;
    m_botRight = super.m_botRight;
    m_left = super.m_left;
    m_right = super.m_right;
    m_top = super.m_top;
    m_bot = super.m_bot;
    m_background = super.m_background;
    m_backgroundSelection = super.m_backgroundSelection;
    m_backgroudRepeat = super.m_backgroudRepeat;
    m_arrowEndMessage = super.m_arrowEndMessage;
    m_arrowTargetSelection = super.m_arrowTargetSelection;
    m_arrowUpDown = super.m_arrowUpDown;
    m_textNormal = super.m_textNormal;
    m_textCritical = super.m_textCritical;
    m_textHeal = super.m_textHeal;
    m_textMiss = super.m_textMiss;
}

// -------------------------------------------------------

void SystemWindowSkin::read(const QJsonObject &json) {
    SuperListItem::read(json);
    QJsonArray tab;

    m_pictureID = json[JSON_PICTURE_ID].toInt();

    tab = json[JSON_TOP_LEFT].toArray();
    Common::readRectF(tab, m_topLeft);
    tab = json[JSON_TOP_RIGHT].toArray();
    Common::readRectF(tab, m_topRight);
    tab = json[JSON_BOT_LEFT].toArray();
    Common::readRectF(tab, m_botLeft);
    tab = json[JSON_BOT_RIGHT].toArray();
    Common::readRectF(tab, m_botRight);
    tab = json[JSON_LEFT].toArray();
    Common::readRectF(tab, m_left);
    tab = json[JSON_RIGHT].toArray();
    Common::readRectF(tab, m_right);
    tab = json[JSON_TOP].toArray();
    Common::readRectF(tab, m_top);
    tab = json[JSON_BOT].toArray();
    Common::readRectF(tab, m_bot);
    tab = json[JSON_BACKGROUND].toArray();
    Common::readRectF(tab, m_background);
    tab = json[JSON_BACKGROUND_SELECTION].toArray();
    Common::readRectF(tab, m_backgroundSelection);
    m_backgroudRepeat = json[JSON_BACKGROUND_REPEAT].toBool();
    tab = json[JSON_ARROW_END_MESSAGE].toArray();
    Common::readRectF(tab, m_arrowEndMessage);
    tab = json[JSON_ARROW_TARGET_SELECTION].toArray();
    Common::readRectF(tab, m_arrowTargetSelection);
    tab = json[JSON_ARROW_UP_DOWN].toArray();
    Common::readRectF(tab, m_arrowUpDown);
    tab = json[JSON_TEXT_NORMAL].toArray();
    Common::readRectF(tab, m_textNormal);
    tab = json[JSON_TEXT_CRITICAL].toArray();
    Common::readRectF(tab, m_textCritical);
    tab = json[JSON_TEXT_HEAL].toArray();
    Common::readRectF(tab, m_textHeal);
    tab = json[JSON_TEXT_MISS].toArray();
    Common::readRectF(tab, m_textMiss);
}

// -------------------------------------------------------

void SystemWindowSkin::write(QJsonObject &json) const {
    SuperListItem::write(json);
    QJsonArray tab;

    json[JSON_PICTURE_ID] = m_pictureID;

    Common::writeRectF(tab, m_topLeft);
    json[JSON_TOP_LEFT] = tab;
    tab = QJsonArray();
    Common::writeRectF(tab, m_topRight);
    json[JSON_TOP_RIGHT] = tab;
    tab = QJsonArray();
    Common::writeRectF(tab, m_botLeft);
    json[JSON_BOT_LEFT] = tab;
    tab = QJsonArray();
    Common::writeRectF(tab, m_botRight);
    json[JSON_BOT_RIGHT] = tab;
    tab = QJsonArray();
    Common::writeRectF(tab, m_left);
    json[JSON_LEFT] = tab;
    tab = QJsonArray();
    Common::writeRectF(tab, m_right);
    json[JSON_RIGHT] = tab;
    tab = QJsonArray();
    Common::writeRectF(tab, m_top);
    json[JSON_TOP] = tab;
    tab = QJsonArray();
    Common::writeRectF(tab, m_bot);
    json[JSON_BOT] = tab;
    tab = QJsonArray();
    Common::writeRectF(tab, m_background);
    json[JSON_BACKGROUND] = tab;
    tab = QJsonArray();
    Common::writeRectF(tab, m_backgroundSelection);
    json[JSON_BACKGROUND_SELECTION] = tab;
    tab = QJsonArray();
    json[JSON_BACKGROUND_REPEAT] = m_backgroudRepeat;
    Common::writeRectF(tab, m_arrowEndMessage);
    json[JSON_ARROW_END_MESSAGE] = tab;
    tab = QJsonArray();
    Common::writeRectF(tab, m_arrowTargetSelection);
    json[JSON_ARROW_TARGET_SELECTION] = tab;
    tab = QJsonArray();
    Common::writeRectF(tab, m_arrowUpDown);
    json[JSON_ARROW_UP_DOWN] = tab;
    tab = QJsonArray();
    Common::writeRectF(tab, m_textNormal);
    json[JSON_TEXT_NORMAL] = tab;
    tab = QJsonArray();
    Common::writeRectF(tab, m_textCritical);
    json[JSON_TEXT_CRITICAL] = tab;
    tab = QJsonArray();
    Common::writeRectF(tab, m_textHeal);
    json[JSON_TEXT_HEAL] = tab;
    tab = QJsonArray();
    Common::writeRectF(tab, m_textMiss);
    json[JSON_TEXT_MISS] = tab;
}
