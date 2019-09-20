/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDSHOWTEXT_H
#define DIALOGCOMMANDSHOWTEXT_H

#include "dialogcommand.h"
#include "systempicture.h"

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
    static const QString TAG_BOLD;
    static const QString TAG_ITALIC;
    static const QString TAG_LEFT;
    static const QString TAG_CENTER;
    static const QString TAG_RIGHT;
    static const QString TAG_FONT_SIZE;
    static const QString TAG_FONT_NAME;
    static const QString TAG_TEXT_COLOR;
    static const QString TAG_BACK_COLOR;
    static const QString TAG_STROKE_COLOR;
    static const QString TAG_VARIABLE;
    static const QString TAG_PARAMETER;
    static const QString TAG_PROPERTY;
    static const QString TAG_HERO_NAME;
    static const QString TAG_ICON;

    explicit DialogCommandShowText(EventCommand *command = nullptr,
        SystemCommonObject *object = nullptr, QStandardItemModel *parameters =
        nullptr, QWidget *parent = nullptr);
    virtual ~DialogCommandShowText();

    virtual EventCommand * getCommand() const;

protected:
    SuperListItem *m_facesetID;
    QStandardItemModel *m_parameters;
    QStandardItemModel *m_properties;

    void initializeWidgets(SystemCommonObject *object, QStandardItemModel
        *parameters);
    void insertTag(int index, QComboBox *combobox, QString tag,
        QStandardItemModel *model, int modelIndex);
    void insertNoValueTag(QString tag);

    virtual void initialize(EventCommand* command);

private:
    Ui::DialogCommandShowText *ui;

public slots:
    void on_pushButtonBold_clicked();
    void on_pushButtonItalic_clicked();
    void on_pushButtonLeft_clicked();
    void on_pushButtonCenter_clicked();
    void on_pushButtonRight_clicked();
    void on_comboBoxFontSize_currentIndexChanged(int index);
    void on_comboBoxFontName_currentIndexChanged(int index);
    void on_comboBoxTextColor_currentIndexChanged(int index);
    void on_comboBoxBackColor_currentIndexChanged(int index);
    void on_comboBoxStrokeColor_currentIndexChanged(int index);
    void on_comboBoxVariable_currentIndexChanged(int index);
    void on_comboBoxParameters_currentIndexChanged(int index);
    void on_comboBoxProperties_currentIndexChanged(int index);
    void on_comboBoxHeroName_currentIndexChanged(int index);
    void on_comboBoxIcon_currentIndexChanged(int index);
};

#endif // DIALOGCOMMANDSHOWTEXT_H
