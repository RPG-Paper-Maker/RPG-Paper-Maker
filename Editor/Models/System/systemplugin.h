/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMPLUGIN_H
#define SYSTEMPLUGIN_H

#include <QMetaType>
#include "systemscript.h"
#include "plugintypekind.h"
#include "plugincategorykind.h"

// -------------------------------------------------------
//
//  CLASS SystemPlugin
//
//  A particulary plugin (datas).
//
// -------------------------------------------------------

class SystemPlugin : public SystemScript
{
public:
    static const QString JSON_CATEGORY_BATTLE;
    static const QString JSON_CATEGORY_MENUS;
    static const QString JSON_CATEGORY_MAP;
    static const QString JSON_CATEGORY_OTHERS;
    static const QString JSON_IS_ON;
    static const QString JSON_TYPE;
    static const QString JSON_CATEGORY;
    static const QString JSON_AUTHOR;
    static const QString JSON_WEBSITE;
    static const QString JSON_DESCRIPTION;
    static const QString JSON_VERSION;
    static const QString JSON_TUTORIAL;
    static const QString JSON_DEFAULT_PARAMETERS;
    static const QString JSON_PARAMETERS;
    static const QString JSON_COMMANDS;
    static const bool DEFAULT_IS_ON;
    static const PluginTypeKind DEFAULT_TYPE;
    static const PluginCategoryKind DEFAULT_CATEGORY;
    static const QString DEFAULT_AUTHOR;
    static const QString DEFAULT_WEBSITE;
    static const QString DEFAULT_DESCRIPTION;
    static const QString DEFAULT_VERSION;
    static const QString DEFAULT_TUTORIAL;
    static const QString NAME_CODE;
    static const QString NAME_JSON;

    SystemPlugin();
    SystemPlugin(int i, QString n, bool io = DEFAULT_IS_ON, PluginTypeKind t =
        DEFAULT_TYPE, PluginCategoryKind c = DEFAULT_CATEGORY, QString a =
        DEFAULT_AUTHOR, QString w = DEFAULT_WEBSITE, QString d =
        DEFAULT_DESCRIPTION, QString v = DEFAULT_VERSION, QString tu =
        DEFAULT_TUTORIAL);
    virtual ~SystemPlugin();
    bool displayIsOn() const;
    bool isON() const;
    PluginTypeKind type() const;
    PluginCategoryKind category() const;
    QString author() const;
    QString website() const;
    QString description() const;
    QString version() const;
    QString tutorial() const;
    QStandardItemModel * defaultParameters() const;
    QStandardItemModel * parameters() const;
    QStandardItemModel * commands() const;
    bool editChanged() const;
    bool defaultParametersChanged() const;
    SystemPlugin * editedPlugin() const;
    bool isOnline() const;
    void setDisplayIsOn(bool displayIsOn);
    void setIsON(bool isON);
    void setType(PluginTypeKind type);
    void setCategory(PluginCategoryKind category);
    void setAuthor(QString author);
    void setWebsite(QString website);
    void setDescription(QString description);
    void setVersion(QString version);
    void setTutorial(QString tutorial);
    void setEditChanged(bool editChanged);
    void setDefaultParametersChanged(bool defaultParametersChanged);
    void setIsOnline(bool isOnline);

    QString getJSONCategory() const;
    QString getFolderPath() const;
    QString getJSONPath() const;
    bool checkPluginName(QString previousName) const;
    void readFromPath();
    void initializeEditedPlugin();
    void initializeHeaders();
    void clearDefaultParameters();
    void clearParameters();
    void clearCommands();
    void removeEditedPlugin();

    virtual bool checkChanged() const;
    virtual QString getPath() const;
    virtual void setDefault();
    virtual bool openDialog();
    virtual SuperListItem * createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual QList<QStandardItem*> getModelRow() const;
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    bool m_displayIsOn;
    bool m_isON;
    PluginTypeKind m_type;
    PluginCategoryKind m_category;
    QString m_author;
    QString m_website;
    QString m_description;
    QString m_version;
    QString m_tutorial;
    QStandardItemModel *m_defaultParameters;
    QStandardItemModel *m_parameters;
    QStandardItemModel *m_commands;
    bool m_editChanged;
    bool m_defaultParametersChanged;
    SystemPlugin *m_editedPlugin;
    bool m_isOnline;
};

Q_DECLARE_METATYPE(SystemPlugin)

#endif // SYSTEMPLUGIN_H
