/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGSCRIPTS_H
#define DIALOGSCRIPTS_H

#include <QDialog>
#include <QModelIndex>
#include "widgetcodelinenumberarea.h"
#include "codesyntaxhighlighter.h"
#include "systemplugin.h"

// -------------------------------------------------------
//
//  CLASS DialogScripts
//
//  Dialog for system and plugins scripts management.
//
// -------------------------------------------------------

namespace Ui {
class DialogScripts;
}

class DialogScripts : public QDialog
{
    Q_OBJECT

public:
    explicit DialogScripts(QWidget *parent = nullptr);
    ~DialogScripts();

    SystemScript * getSelectedScript() const;
    SystemPlugin * getSelectedPlugin() const;
    void initialize();
    void updateScriptCodeSave();
    void updatePluginCodeSave();
    void updatePluginEditSave();

protected:
    virtual void keyPressEvent(QKeyEvent *event);

private:
    Ui::DialogScripts *ui;
    WidgetCodeLineNumberArea *m_widgetLineNumber;
    CodeSyntaxHighlighter *m_highlighterSystem;
    WidgetCodeLineNumberArea *m_widgetLineNumberPlugin;
    CodeSyntaxHighlighter *m_highlighterPlugin;

public slots:
    void on_scriptSystemSelected(QModelIndex, QModelIndex);
    void on_scriptPluginSelected(QModelIndex, QModelIndex);
    void on_pluginListUpdated();
    void on_pushButtonOpenPluginFolder_clicked();
    void on_scriptCodeNeedSave();
    void on_pluginCodeNeedSave();
    void on_treeViewPluginsItemChanged(QStandardItem *item);
    void on_lineEditName_textEdited(const QString &text);
    void on_lineEditAuthor_textEdited(const QString &text);
    void on_plainTextEditDescription_textChanged();
    void on_lineEditVersion_textEdited(const QString &text);
    void on_lineEditWebsite_textEdited(const QString &text);
    void on_lineEditTutorial_textEdited(const QString &text);
};

#endif // DIALOGSCRIPTS_H
