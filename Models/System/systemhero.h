/*
    RPG Paper Maker Copyright (C) 2017-2018 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

#ifndef SYSTEMHEROES_H
#define SYSTEMHEROES_H

#include "systemlang.h"
#include "systempicture.h"
#include "systemclass.h"

// -------------------------------------------------------
//
//  CLASS SystemHero
//
//  A particulary hero (datas).
//
// -------------------------------------------------------

class SystemHero : public SystemLang
{
public:
    static const QString jsonClass;
    static const QString jsonBattler;
    static const QString jsonFaceset;
    static const QString jsonClassInherit;

    SystemHero();
    SystemHero(int i, LangsTranslation* names, int idClass, int idBattler, int
        idFaceset, SystemClass *classInherit);
    virtual ~SystemHero();
    int idClass() const;
    void setIdClass(int id);
    int idBattlerPicture() const;
    void setIdBattlerPicture(int id);
    int idFacesetPicture() const;
    void setIdFacesetPicture(int id);
    SystemClass * classInherit() const;
    SystemPicture* getPictureBattler() const;
    SystemPicture* getPictureFaceset() const;
    SystemClass * getClass() const;

    virtual SuperListItem* createCopy() const;
    void setCopy(const SystemHero& hero);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    int m_idClass;
    int m_idBattlerPicture;
    int m_idFacesetPicture;
    SystemClass * m_classInherit;
};

Q_DECLARE_METATYPE(SystemHero)

#endif // SYSTEMHEROES_H
