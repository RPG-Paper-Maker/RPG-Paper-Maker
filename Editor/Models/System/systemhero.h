/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMHEROES_H
#define SYSTEMHEROES_H

#include "systemtranslatable.h"
#include "systempicture.h"
#include "systemclass.h"

// -------------------------------------------------------
//
//  CLASS SystemHero
//
//  A particulary hero (datas).
//
// -------------------------------------------------------

class SystemHero : public SystemTranslatable
{
public:
    static const QString JSON_CLASS;
    static const QString JSON_BATTLER;
    static const QString JSON_FACESET;
    static const QString JSON_INDEX_X_FACESET;
    static const QString JSON_INDEX_Y_FACESET;
    static const QString JSON_CLASS_INHERIT;
    static const QString JSON_DESCRIPTION;
    static const int DEFAULT_ID;
    static const QString DEFAULT_NAME;
    static const int DEFAULT_ID_CLASS;
    static const int DEFAULT_ID_BATTLER;
    static const int DEFAULT_ID_FACESET;
    static const int DEFAULT_INDEX_X_FACESET;
    static const int DEFAULT_INDEX_Y_FACESET;

    SystemHero(int i = DEFAULT_ID, QString name = DEFAULT_NAME, int idClass =
        DEFAULT_ID_CLASS, int idBattler = DEFAULT_ID_BATTLER, int idFaceset =
        DEFAULT_ID_FACESET, int indexXFaceset = DEFAULT_INDEX_X_FACESET, int
        indexYFaceset = DEFAULT_INDEX_Y_FACESET, SystemClass *classInherit = new
        SystemClass, SystemTranslatable *description = new SystemTranslatable);
    virtual ~SystemHero();
    int idClass() const;
    void setIdClass(int id);
    int idBattlerPicture() const;
    void setIdBattlerPicture(int id);
    int idFacesetPicture() const;
    void setIdFacesetPicture(int id);
    int indexXFacesetPicture() const;
    void setIndexXFacesetPicture(int indexXFacesetPicture);
    int indexYFacesetPicture() const;
    void setIndexYFacesetPicture(int indexYFacesetPicture);
    SystemClass * classInherit() const;
    SystemTranslatable * description() const;

    SystemPicture * getPictureBattler() const;
    SystemPicture * getPictureFaceset() const;
    SystemClass * getClass() const;
    int maxLevel() const;

    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    int m_idClass;
    int m_idBattlerPicture;
    int m_idFacesetPicture;
    int m_indexXFacesetPicture;
    int m_indexYFacesetPicture;
    SystemClass *m_classInherit;
    SystemTranslatable *m_description;
};

Q_DECLARE_METATYPE(SystemHero)

#endif // SYSTEMHEROES_H
