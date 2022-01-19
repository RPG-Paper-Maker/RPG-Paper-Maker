/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemfont.h"
#include "rpm.h"
#include "common.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemFont::SystemFont() :
    SystemFont(-1, "<" + RPM::translate(Translations::NONE) + ">", false)
{

}

SystemFont::SystemFont(int i, QString n, bool isBR, QString dlc) :
    SystemResource(i, n, isBR, dlc)
{

}

SystemFont::~SystemFont() {

}

bool SystemFont::isBR() const {
    return m_isBR;
}

void SystemFont::setIsBR(bool b) {
    m_isBR = b;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

SystemFont * SystemFont::getByID(int id) {
    return reinterpret_cast<SystemFont *>(SuperListItem::getById(RPM::get()
        ->project()->videosDatas()->model()->invisibleRootItem(), id));
}

// -------------------------------------------------------

QString SystemFont::getFolder(bool isBR, QString dlc) {
    return Common::pathCombine(SystemResource::getFolder(isBR, dlc),
        SystemFont::getLocalFolder());
}

// -------------------------------------------------------

QString SystemFont::getLocalFolder() {
    return RPM::PATH_FONTS;
}

// -------------------------------------------------------

QString SystemFont::getCSS(QString name) const
{
    return "@font-face {\n\tfont-family: \"" + name + "\";\n\tsrc: url(\"" + (
        this->isBR() || !this->dlc().isEmpty() ? this->getPath() : "../Fonts/" +
        this->name()) + "\");\n}\n";
}

// -------------------------------------------------------

QString SystemFont::getPath() const {
    if (id() == -1) {
        return "";
    }

    QString folder = getFolder(m_isBR, m_dlc);

    return Common::pathCombine(folder, name());
}

// -------------------------------------------------------

QString SystemFont::getLocalPath() const {
    QString folder = getLocalFolder();

    return Common::pathCombine(folder, name());
}

// -------------------------------------------------------
//
// VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

SuperListItem * SystemFont::createCopy() const {
    SystemFont *super = new SystemFont;
    super->setCopy(*this);
    return super;
}
