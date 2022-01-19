/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDSHOWTEXT_H
#define DIALOGCOMMANDSHOWTEXT_H

#include <QProcess>
#include <QTimer>
#include "dialogcommand.h"
#include "systempicture.h"
#include "widgetcomplexmessage.h"

// -------------------------------------------------------
//
//  CLASS DialogCommandShowText
//
//  A dialog used for displaying text on HUD.
//
// -------------------------------------------------------

namespace Ui {
class DialogCommandShowText;
}

class DialogCommandShowText : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandShowText(EventCommand *command = nullptr,
        QStandardItemModel *properties = nullptr, QStandardItemModel *parameters =
        nullptr, QWidget *parent = nullptr);
    virtual ~DialogCommandShowText();

    virtual EventCommand * getCommand() const;

protected:
    SuperListItem *m_facesetID;
    SuperListItem *m_facesetIndexX;
    SuperListItem *m_facesetIndexY;
    QStandardItemModel *m_parameters;
    QStandardItemModel *m_properties;
    QHash<int, WidgetComplexMessage *> m_widgets;
    QProcess *m_gameProcess;
    QTimer *m_timer;

    void initializeWidgets(QStandardItemModel *properties, QStandardItemModel
        *parameters);

    virtual void initialize(EventCommand* command);

private:
    Ui::DialogCommandShowText *ui;

    void translate();

public slots:
    virtual void accept();
    virtual void reject();
    void on_pushButtonPreview_clicked();
    void updateTestFile();
};

#endif // DIALOGCOMMANDSHOWTEXT_H
